import { Move } from "@panda-chess/pdc-core";
import { minmaxAlgo } from "@panda-chess/pdc-ai";
import { databaseService } from "@panda-chess/pdc-microservices-agregator";
import { Router } from "express";

const router = Router();

router.post("/", async (req, res) => {
    const gameID: string = req.body.gameId;
    const move: Move = req.body.move;

    const game = await databaseService.getGameById(gameID);

    const moves = minmaxAlgo(game.gamePieces, game.currentColor);
    const currentMove = moves.find(m => m.move.from.pieceId === move.from.pieceId);

    if (!currentMove) {
        res.status(400).send();
        return;
    }

    await databaseService.modifyGame({
        ...game,
        users: game.users.map(u => {
            if (u.color === game.currentColor) {
                return {
                    ...u,
                    gamePoints: u.gamePoints + currentMove.value
                };
            }

            return u;
        }),
    });

    res.status(200).send({ moveValue: currentMove.value });
});

export default router;
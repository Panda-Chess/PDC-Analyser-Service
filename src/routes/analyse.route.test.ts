import { describe } from '@jest/globals';
import axios from 'axios';
import { createTestGame, deleteTestGame } from "../utils/tests/game.operations";
import { PieceType, getMoves } from '@panda-chess/pdc-core';
import { databaseService } from '@panda-chess/pdc-microservices-agregator';

describe('analyse router', () => {
    it('should modify game score', async () => {
        const testGame = await createTestGame();

        const response = await axios.post("http://localhost:3002/analyse", {
            gameId: testGame._id,
            move: getMoves(testGame.gamePieces.find(x => x.color === "white" && x.pieceType === PieceType.Pawn)!, testGame.gamePieces)[0]
        });

        expect(response.status).toBe(200);
        expect(response.data.moveValue).toBeDefined();

        const updatedGame = await databaseService.getGameById(testGame._id!);

        await deleteTestGame(testGame);
    });
});
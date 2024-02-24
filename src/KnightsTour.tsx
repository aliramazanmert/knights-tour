import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Form, InputNumber } from "antd";

function timeout(delay: number) {
  return new Promise((res) => setTimeout(res, delay));
}

const moves = [
  { x: 2, y: 1 },
  { x: 2, y: -1 },
  { x: -2, y: 1 },
  { x: -2, y: -1 },
  { x: 1, y: 2 },
  { x: 1, y: -2 },
  { x: -1, y: 2 },
  { x: -1, y: -2 },
];

const isValidMove = (board: number[][], x: number, y: number) => {
  return x >= 0 && x < 8 && y >= 0 && y < 8 && !board[y][x];
};

const initializeBoard = () => {
  return new Array(8).fill(0).map(() => new Array(8).fill(0));
};

interface Props {
  remount: () => void;
}

function KnightsTour({ remount }: Props) {
  const [board, setBoard] = useState(initializeBoard);
  const boardRef = useRef<number[][]>();
  const [knightPosition, setKnightPosition] = useState({ x: 3, y: 3 });
  const knightPositionRef = useRef<{ x: number; y: number }>();

  const [isRunning, setIsRunning] = useState(false);
  const [isBacktracking, setIsBacktracking] = useState(false);

  useEffect(() => {
    boardRef.current = board;
  }, [board]);

  useEffect(() => {
    knightPositionRef.current = knightPosition;
  }, [knightPosition]);

  const dfs = async (numMoves: number) => {
    if (numMoves === 64) return true;

    for (let i = 0; i < 8; i++) {
      const move = moves[i];

      const nextX = knightPositionRef.current!.x + move.x;
      const nextY = knightPositionRef.current!.y + move.y;

      if (!isValidMove(boardRef.current!, nextX, nextY)) continue;

      setBoard((prevBoard) => {
        return prevBoard.map((row, y) => {
          return row.map((cell, x) => {
            if (x === nextX && y === nextY) {
              return numMoves;
            }
            return cell;
          });
        });
      });

      setKnightPosition((prevKnightPosition) => ({
        x: prevKnightPosition.x + move.x,
        y: prevKnightPosition.y + move.y,
      }));
      setIsBacktracking(false);

      await timeout(1000);

      if (await dfs(numMoves + 1)) return true;
      setIsBacktracking(true);

      setKnightPosition((prevKnightPosition) => {
        return {
          x: prevKnightPosition.x - move.x,
          y: prevKnightPosition.y - move.y,
        };
      });

      setBoard((prevBoard) => {
        return prevBoard.map((row, y) => {
          return row.map((cell, x) => {
            if (x === nextX && y === nextY) {
              return 0;
            }
            return cell;
          });
        });
      });

      await timeout(1000);
    }
    return false;
  };

  const toggleAlgorithmRun = () => {
    if (isRunning) {
      remount();
    } else {
      setBoard((prevBoard) => {
        return prevBoard.map((row, y) => {
          return row.map((cell, x) => {
            if (x === knightPosition.x && y === knightPosition.y) {
              return 1;
            }
            return cell;
          });
        });
      });
      setIsRunning(true);
      dfs(2);
    }
  };

  const handleInputChange = (field: string) => (value: number | null) => {
    if (value) setKnightPosition((prev) => ({ ...prev, [field]: value - 1 }));
  };

  return (
    <div className="relative flex flex-col gap-2">
      <img
        src="https://static.wikia.nocookie.net/chess/images/3/32/LightKnight.png"
        width={80}
        height={80}
        className="absolute transition-all duration-300 z-10"
        style={{
          filter: isBacktracking ? "brightness(0.25)" : "",
          left: knightPosition.x * 80 + "px",
          top: knightPosition.y * 80 + "px",
        }}
      />
      <div>
        {board.map((row, i) => (
          <div className="flex">
            {row.map((cell, j) => (
              <div
                className={`relative h-20 w-20 bg-opacity-75 ${
                  (i + j) % 2 === 0 ? "bg-yellow-100" : "bg-orange-900"
                }`}
              >
                <span className="absolute right-1 bottom-0 text-black">
                  {cell || null}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex gap-3 justify-center">
        <Form.Item
          colon={false}
          label={<label className="text-white">X</label>}
        >
          <InputNumber
            value={knightPosition.x + 1}
            onChange={handleInputChange("x")}
            disabled={isRunning}
            controls={false}
            min={1}
            max={8}
          />
        </Form.Item>
        <Form.Item
          colon={false}
          label={<label className="text-white">Y</label>}
        >
          <InputNumber
            value={knightPosition.y + 1}
            onChange={handleInputChange("y")}
            disabled={isRunning}
            controls={false}
            min={1}
            max={8}
          />
        </Form.Item>
      </div>
      <button onClick={toggleAlgorithmRun}>
        {isRunning ? "Reset" : "Start"}
      </button>
    </div>
  );
}

export default KnightsTour;

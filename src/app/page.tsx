"use client";

import { useState } from "react";

export default function HomePage() {
  const [listName, setListName] = useState("");
  const [maxNumber, setMaxNumber] = useState(0);
  const [limitDatetime, setLimitDatetime] = useState("");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-auto flex items-center">
            <label
              htmlFor="list-name-input"
              className="mb-2 block text-sm font-medium text-gray-400 dark:text-white"
            >
              Nome da lista:
            </label>
          </div>
          <div className="col-auto">
            <input
              type="text"
              id="list-name-input"
              required
              aria-describedby="helper-text-explanation"
              value={listName}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-400 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              onChange={(e) => setMaxNumber(Number(e.target.value))}
            />
          </div>
          <div className="col-auto flex items-center">
            <label
              htmlFor="max-number-input"
              className="mb-2 block text-sm font-medium text-gray-400 dark:text-white"
            >
              Número máximo de jogadores da lista:
            </label>
          </div>
          <div className="col-auto">
            <input
              type="number"
              id="max-number-input"
              value={maxNumber}
              aria-describedby="helper-text-explanation"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-400 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              onChange={(e) => setMaxNumber(Number(e.target.value))}
            />
          </div>
          <div className="col-auto flex items-center">
            <label
              htmlFor="limit-datetime-input"
              className="mb-2 block text-sm font-medium text-gray-400 dark:text-white"
            >
              Data Limite para retirar o nome e não pagar:
            </label>
          </div>
          <div className="col-auto">
            <input
              type="datetime-local"
              id="limit-datetime-input"
              value={limitDatetime}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-400 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              onChange={(e) => setLimitDatetime(e.target.value)}
            />
          </div>
        </div>
        <button
          type="button"
          className="mb-2 me-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-400 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
        >
          Criar lista
        </button>
      </div>
    </main>
  );
}

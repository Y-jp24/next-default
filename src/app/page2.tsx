"use client";

import Image from "next/image";
import { useState } from "react";
import TodoApp from "../components/TodoApp";
import TodoList from "@/components/TodoList";

export default function Home() {

  return (
    <div>
      <section className="flex flex-col justify-center">
      <TodoApp />
      ああああ
      <TodoList />
      </section>

    </div>
  );
}

import React, { useEffect } from 'react'
import { useState } from 'react'

const TodoApp = () => {

  const [todos, setTodos] = useState([])

  useEffect(() => {
    console.log('TodoApp component mounted.')
  }  
    , [])

  return (
    <section className='text-center mb-2 text-2xl font-medium'> 
        <h3>Supabase TodoApp</h3>
        <form>
          <input type='text' className='shadow-lg p-1 outline-none mr-2' placeholder='Add a new todo' />
          <button className='bg-green-500 text-white p-1 border-2 shadow-md rounded-lg'>Add</button>
        </form>
    </section>
  )
}

export default TodoApp
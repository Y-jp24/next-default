import React from 'react'

const TodoList = () => {
  return (
    <div>
        <ul className='mx-auto'>
            <div　className='flex bg-orange-200 rounded-md m-1 p-1 justify-between'>
                <li className='p-1 m-1'>✅ Todo 1</li>
                <span className='cursor-pointer'>✖️</span>
            </div>
            <div　className='flex bg-orange-200 rounded-md m-1 p-1 justify-between'>
                <li className='p-1 m-1'>✅ Todo 1</li>
                <span className='cursor-pointer'>✖️</span>
            </div>
            <div　className='flex bg-orange-200 rounded-md m-1 p-1 justify-between'>
                <li className='p-1 m-1'>✅ Todo 1</li>
                <span className='cursor-pointer'>✖️</span>
            </div>
        </ul>
    </div>
  )
}

export default TodoList
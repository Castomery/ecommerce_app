import React from 'react'

const NewletterBox = () => {

    const handleSubmit = (event) => {
        event.prevetDefault();
    }

    return (
        <div className='text-center'>
            <p className='text-2xl font-medium text-gray-800'>Subscribe now & get 20% offf</p>
            <p className='text-gray-400 mt-3'>lo
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Esse illum dolor unde impedit ipsum suscipit nisi iusto officiis rem dicta. Numquam incidunt, quos facere adipisci illo dolorem assumenda eos ducimus.
            </p>
            <form onSubmit={handleSubmit} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
                <input type="email" placeholder='Enter your email' className='w-full sm:flex-1 outline-none' />
                <button type='submit' className='bg-black text-white text-xs px-10 py-4'>SUBSCRIBE</button>
            </form>
        </div>
    )
}

export default NewletterBox
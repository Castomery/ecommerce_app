import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewletterBox from '../components/NewletterBox'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
          <Title text1={"ABOUT"} text2={"US"}/>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img src={assets.about_img} alt="" className='w-full md:max-w-[450px]' />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel porro magnam natus. Itaque ullam officiis eos voluptatibus. Quas, maxime asperiores quo quasi aut amet totam veritatis quod! Dolorum, totam quos.
            </p>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptate doloremque esse fuga dignissimos, cum ab dolor repudiandae reiciendis unde rem nostrum nihil fugiat quis quod odit cupiditate alias incidunt! Autem.
            </p>
            <b className='text-gray-800'>Our Mission</b>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora, natus? Molestias aspernatur earum atque dicta iure error id esse ipsa, quasi excepturi mollitia. Eligendi, tenetur rerum ipsam reprehenderit aperiam ut!
            </p>
        </div>
      </div>
      <div className='text-xl py-4'>
          <Title text1={"WHY"} text2={"CHOOSE US"}/>
      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deserunt voluptatem neque impedit, libero consectetur voluptatum possimus harum, non mollitia dolores quo omnis officia modi maiores laudantium repellat eaque cupiditate reprehenderit.
          </p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className='text-gray-600'>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deserunt voluptatem neque impedit, libero consectetur voluptatum possimus harum, non mollitia dolores quo omnis officia modi maiores laudantium repellat eaque cupiditate reprehenderit.
          </p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional customer service:</b>
          <p className='text-gray-600'>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deserunt voluptatem neque impedit, libero consectetur voluptatum possimus harum, non mollitia dolores quo omnis officia modi maiores laudantium repellat eaque cupiditate reprehenderit.
          </p>
        </div>
      </div>

      <NewletterBox/>
    </div>
  )
}

export default About
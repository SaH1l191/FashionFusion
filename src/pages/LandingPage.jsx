import { useTypewriter , Cursor } from 'react-simple-typewriter';
import Testimonials from '../components/Testimonials';
import herologo from '../assets/herologo.png';
import dlogo from '../assets/logo.png';
import section_3 from '../assets/section_3.png';
import section_4_bg from '../assets/section_4.png';
import section_5 from '../assets/section_5.png';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {

  const navigate = useNavigate();


  const [typeEffect ] = useTypewriter({
    words : ["Display your strengths","Grow your business"],
    loop : true,
    typeSpeed : 40,
    deleteSpeed : 30,
    
  })

  return (
    <div>
        
      
      {/* section 1 */}
      <section className='flex flex-col min-h-screen w-[1440px] mx-auto mt-52 space-y-60'>
        <div className='flex items-center justify-between gap-10'>
          <div className='w-[50%]' data-aos="fade-right">
            <div className='p-4 space-y-6'>
              <h1 className='text-6xl font-bold text-transparent bg-gradient-to-r from-slate-800 to-indigo-600 bg-clip-text'>Fashion Fusion</h1>
              <div className='flex flex-col text-5xl font-bold'>
                <p className='text-[#030303] w-3/4'>The best way
                 to {" "} {<br></br>}
                 <span className='font-bold text-green-500'>{typeEffect}</span>
                </p>
              </div>

              <p>"Optimize your clothing business with our platform."</p>
              <div className='flex gap-10'>
                <button className="px-2 py-2 text-sm font-medium text-black transition duration-200 border-2 border-gray-400 rounded-lg white hover:bg-gray-300" onClick={() => navigate('/signup')}>Try for free</button>
                <button className='px-4 py-2 font-bold text-white bg-black rounded' onClick={() => navigate('/pricing')}>See how it works</button>
              </div>
            </div>
          </div>

          <div className='w-[50%]' data-aos="fade-down">
            <img src={herologo} alt='herologo' className='object-cover rounded-3xl' />
          </div>
        </div>
      </section>

      {/* section 2 */}
      <section className='flex flex-col h-screen pt-[4rem] bg-[#ededed]'>
        <div className='w-[1440px] mx-auto items-center flex justify-between'>
          <div className='flex justify-center w-[85%] mx-auto bg-white rounded-2xl' data-aos="fade-up-right">
            <div className='flex items-center p-5 h-[479px] rounded-lg justify-between gap-3'>
              <div className='flex flex-col justify-center w-[45%] items-start'>
                <h1 className='mb-4 text-4xl font-bold text-black'>Introducing Great Solution</h1>
                <p className='mb-6 text-lg text-gray-600'>
                  Join our community and experience the benefits today!
                </p>
                <button onClick={()=>navigate('/signup')} className='px-6 py-3 font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-600'>
                  Try for Free
                </button>
              </div>
              <div className='w-[60%] rounded-3xl ml-14'>
                <img src={dlogo} className='object-contain w-full h-full rounded-3xl' />
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* section 3 */}
        <section className="bg-[#ededed] py-8 px-8">
          <div className="flex flex-col items-center justify-between mx-auto max-w-7xl md:flex-row">
            <div className="w-[50%]">
              <img 
                src={section_3} 
                alt="Trend Analysis Visual" 
                className="object-cover w-full h-auto"
              />
            </div>
            <div className="mt-8 md:w-1/2 md:mt-0 md:pl-16" data-aos="fade-right">
              <h4 className="text-sm tracking-wider text-gray-500 uppercase">TREND ANALYSIS</h4>
              <h2 className="mt-2 text-4xl font-bold text-gray-900">Stay Ahead with Cutting-Edge Trend Analysis</h2>
              <p className="mt-4 text-gray-600">
                Our platform helps you identify key market trends through data-driven insights, giving your clothing business a competitive edge. Stay informed and make smarter decisions with our up-to-date analysis of fashion industry movements.
              </p>
              <button onClick={()=>navigate('/signup')} className="px-6 py-3 mt-6 text-sm font-medium text-black transition duration-200 border-2 border-gray-400 rounded-lg white hover:bg-gray-300">
                Explore Now
              </button>
            </div>
          </div>
        </section>


        {/* section 4 */}
        <section className="bg-[#ededed] py-16 px-8 ">
          <div className="flex flex-col items-center justify-between mx-auto max-w-7xl md:flex-row">
            <div className="md:w-1/2 md:pr-16">
              <h4 className="text-sm tracking-wider text-gray-500 uppercase">INVENTORY MANAGEMENT</h4>
              <h2 className="mt-2 text-4xl font-bold text-gray-900" data-aos="fade-left">Efficient Inventory Management for Your Business</h2>
              <p className="mt-4 text-gray-600">
                Streamline your stock management with our smart inventory solution. Keep track of your products in real-time, reduce overstocking and stockouts, and optimize your supply chain for better profitability. Our system ensures your inventory is always in sync, so you can focus on growing your business.
              </p>
              <button onClick={()=>navigate('/signup')} className="px-6 py-3 mt-6 text-sm font-medium text-black border-2 border-gray-400 transition duration-200 bg-[#ededed] rounded-lg hover:bg-slate-300">
                Try now
              </button>
            </div>
            <div className="mt-8 md:w-1/2 md:mt-0">
              <img 
                src={section_4_bg} 
                alt="Inventory Management Visual" 
                className="object-cover w-full h-auto "
              />
            </div>
          </div>
        </section>


        {/* section 5 */}
        
        <section className="bg-[#ededed] py-40 px-8">
          <div className="relative z-10 flex p-8 mx-auto bg-white shadow-2xl rounded-2xl max-w-7xl" data-aos="fade-up">
            {/* Left Section with Image */}
            <div className="relative w-1/2">
              {/* Image positioned to pop out */}
              <img
                src={section_5}
                alt="Community Graphic"
                className="absolute z-10 object-cover w-full h-full -top-1/3 -left-1/5"
              />
              
              {/* Text over the image */}
              <div className="absolute bottom-0 left-0 w-full px-8 bg-white rounded-t-lg bg-opacity-70 ">
                <h2 className="mb-4 text-3xl font-bold">Join Our Community</h2>
                <p className="mb-6 text-gray-600">
                  Become part of a thriving community of clothing business owners and industry experts.
                </p>
                <a
                  href="#"
                  onClick={()=>navigate('/signup')}
                  className="inline-block px-6 py-2 mb-6 text-white transition-colors duration-300 bg-blue-500 rounded hover:bg-blue-600"
                >
                  Sign up now
                </a>
              </div>
            </div>

            {/* Right Section with Steps and Text */}
            
            <div className="flex flex-col justify-center px-20 py-20 pl-8 m-8">
              <div className="space-y-12">
                <div>
                  <h3 className="text-xl font-semibold">Step 1</h3>
                  <p className="text-gray-500">
                    Connect with our team and have a brief introduction to learn how our community can benefit your business.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Step 2</h3>
                  <p className="text-gray-500">
                    Get access to exclusive industry insights, resources, and personalized support tailored to your business needs.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Step 3</h3>
                  <p className="text-gray-500">
                    Join discussions, collaborate, and start growing your clothing business with the help of a supportive community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      <Testimonials/>
        {/* section 6*/}
        <section className="bg-[#ededed] py-16 flex justify-center">
      <div className="flex items-center w-full max-w-5xl p-8 bg-white rounded-lg shadow-md">
        <div className="w-full md:w-1/2">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">Get started with FashionFusion today</h2>
          <p className="mb-6 text-lg text-gray-600">Start optimizing your processes today.</p>
            <a
              href="#"
              onClick={()=>navigate('/signup')}
              className="px-6 py-3 font-semibold text-white transition duration-300 bg-blue-600 rounded hover:bg-blue-500"
            >
            Sign up now
          </a>
        </div>
        <div className="flex justify-center w-full mt-8 md:w-1/2 md:mt-0">
          <img
            src={section_3}
            alt="3D Graphic"
            className="w-64 md:w-80"
          />
        </div>
      </div>
    </section>
    
    </div>
  )
}

export default LandingPage
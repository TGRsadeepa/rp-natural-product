import heroImage from "../assets/images/lemongrass-tea.png";
import { motion } from "framer-motion";

function Hero() {
  return (
    <section className="bg-[#FAF8F2] min-h-screen pt-36">

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center px-8">

        {/* Left */}

        <motion.div
          initial={{opacity:0,y:50}}
          animate={{opacity:1,y:0}}
          transition={{duration:0.8}}
        >

          <p className="text-green-700 tracking-widest uppercase mb-4">
            Pure • Natural • Sri Lankan
          </p>

          <h1 className="text-6xl font-bold leading-tight text-gray-800">

            Nature's Wellness,
            <br/>

            Crafted in
            <span className="text-green-700">
              {" "}Sri Lanka.
            </span>

          </h1>

          <p className="mt-8 text-gray-600 text-lg leading-8">

            Discover premium herbal teas and natural wellness
            products made using carefully selected Sri Lankan
            ingredients.

          </p>

          <div className="flex gap-5 mt-10">

            <button className="bg-green-700 text-white px-8 py-4 rounded-full hover:bg-green-800 transition">

              Shop Now

            </button>

            <button className="border border-green-700 text-green-700 px-8 py-4 rounded-full hover:bg-green-700 hover:text-white transition">

              Learn More

            </button>

          </div>

          <div className="flex items-center gap-8 mt-10 text-sm text-gray-500">
              <div>
                <p className="text-2xl font-bold text-[#2E7D32]">100%</p>
                <p>Natural Ingredients</p>
              </div>

              <div className="w-px h-10 bg-gray-300"></div>

              <div>
                <p className="text-2xl font-bold text-[#2E7D32]">Sri Lanka</p>
                <p>Locally Sourced Herbs</p>
              </div>
            </div>

        </motion.div>

        {/* Right */}

        <motion.div
          initial={{opacity:0,x:100}}
          animate={{opacity:1,x:0}}
          transition={{duration:1}}
          className="flex justify-center"
        >

          <img
            src={heroImage}
            alt="Tea"
            className="w-[500px] drop-shadow-2xl"
          />

        </motion.div>

      </div>

    </section>
  );
}

export default Hero;
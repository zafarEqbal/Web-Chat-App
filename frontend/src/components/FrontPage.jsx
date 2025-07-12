
// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';

// export default function TypingWords() {
//   const words = ['Hi', 'Welcome', 'to', 'The', 'Chat', 'Land'];
//   const [currentWordIndex, setCurrentWordIndex] = useState(0);
//   const [displayedWords, setDisplayedWords] = useState('');

//   useEffect(() => {
//     if (currentWordIndex < words.length) {
//       const timeout = setTimeout(() => {
//         setDisplayedWords((prev) =>
//           prev ? `${prev} ${words[currentWordIndex]}` : words[currentWordIndex]
//         );
//         setCurrentWordIndex((prev) => prev + 1);
//       }, 300);
//       return () => clearTimeout(timeout);
//     } else {
//       // restart after full sentence shown
//       const resetTimeout = setTimeout(() => {
//         setDisplayedWords('');
//         setCurrentWordIndex(0);
//       }, 1500);
//       return () => clearTimeout(resetTimeout);
//     }
//   }, [currentWordIndex]);

//   return (
//     <div className="min-w-110 min-h-auto max-w-auto flex items-center justify-center bg to-purple-900 px-4">
//       <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-lg bg-white/10 border border-white/30">
//         <h1 className="text-2xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-400">
//           {displayedWords}
//           <span className="animate-pulse text-white">|</span>
//         </h1>

//         <h2 className=" font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-800 to-blue-800">Your data is Secure With Us</h2>

//         <div className="space-y-4">
//           <div className="flex justify-center items-center gap-2">
//             <p className="text-gray-300">Already have an account?</p>
//             <Link to="/login">
//               <button className="btn btn-sm rounded-xl bg-white text-black hover:bg-gray-200 shadow-md">
//                 Login
//               </button>
//             </Link>
//           </div>

//           <div className="flex justify-center items-center gap-2">
//             <p className="text-gray-300">Don't have an account?</p>
//             <Link to="/register">
//               <button className="btn btn-sm rounded-xl bg-white text-black hover:bg-gray-200 shadow-md">
//                 Signup
//               </button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaLock, FaRocket, FaShieldAlt, FaInstagram, FaFacebookF, FaWhatsapp } from 'react-icons/fa'; // Fa6 for X (Twitter)
import { FaXTwitter } from 'react-icons/fa6'
export default function TypingWords() {
  const words = ['Welcome to', 'Secure Chat App'];
  const [displayedWords, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (wordIndex >= words.length) return;

    if (charIndex < words[wordIndex].length) {
      const typingTimeout = setTimeout(() => {
        setText((prev) => prev + words[wordIndex][charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(typingTimeout);
    } else {
      const nextWordTimeout = setTimeout(() => {
        setText('');
        setCharIndex(0);
        setWordIndex((prev) => (prev + 1) % words.length);
      }, 2000);
      return () => clearTimeout(nextWordTimeout);
    }
  }, [charIndex, wordIndex]);


  return (
    // <div className="min-w-120 min-h-auto max-w-auto flex items-center justify-center bg to-purple-900 px-4">
    <div className="min-h-screen w-full flex items-center justify-center px-4 bg to-purple-900  ">

      <div className="w-full h-110 max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-lg bg-white/10 border border-white/30">
        <h1 className="text-3xl  font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-400">
          {displayedWords}
          <span className="animate-pulse text-white">|</span>
        </h1>

        <h2 className="text-xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-800 to-blue-800 flex items-center justify-center gap-2">
          <FaLock className="text-2xl text-green-300" /> Your data is Secure With Us

        </h2>
        <p className="text-xl font-semibold italic text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 drop-shadow-lg flex items-center justify-center  transition hover:scale-105 hover:brightness-110">
          <FaShieldAlt className="text-4xl" />
          “Your conversations. Fully encrypted. Seamlessly smooth.”
        </p>


        <div className="space-y-4">
          <div className="flex justify-center items-center gap-2">
            <p className="text-base sm:text-lg md:text-xl text-gray-300 font-bold">Already have an account
              ☺️<Link to="/login">
                <button className="btn btn-sm rounded-xl bg-white text-black hover:bg-gray-300 shadow-md">
                  Login
                </button>
              </Link></p>

          </div>

          <div className="flex justify-center items-center gap-2">
            <p className="text-base sm:text-lg md:text-xl text-gray-300 font-bold">Don't have an account😏</p>
            <Link to="/register">
              <button className="btn btn-sm rounded-xl bg-white text-black hover:bg-gray-300 shadow-md">
                Signup
              </button>
            </Link>
          </div>
          <div className="flex justify-center mt-6">
            <Link to="/login">
              <button className="px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition transform duration-300 flex items-center gap-2 animate-bounce">
                <FaRocket /> Start Chatting
              </button>
            </Link>
          </div>
          

          {/* 👇 Social Icons Section */}
         <div className='mt-auto pt-6'>
           <div className="flex justify-center gap-10 mt-10 text-white text-2xl">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="hover:text-pink-400 transition duration-300" />
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebookF className="hover:text-blue-500 transition duration-300" />
            </a>
            <a href="https://www.whatsapp.com" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp className="hover:text-green-400 transition duration-300" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaXTwitter className="hover:text-gray-400 transition duration-300" />
            </a>
          </div>
         </div>

        </div>
      </div>
    </div>
  );
}





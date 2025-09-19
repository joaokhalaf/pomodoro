import { FaCoffee, FaMinus, FaPlus } from "react-icons/fa";
import useLocalStorage from "../hooks/useLocalStorage";

export const CoffeeTracker = () => {
  const [coffeeCount, setCoffeeCount] = useLocalStorage('coffeeCount', 0);

  const increment = () => setCoffeeCount(prev => prev + 1);
  const decrement = () => setCoffeeCount (prev => prev > 0 ? prev - 1: 0);

return (
  <div className='backdrop-blur-xl bg-black/20 border border-white/10 p-3 sm:p-4 rounded-2xl shadow-2xl h-full flex flex-col'>
      <div className="flex-1 flex flex-col justify-between space-y-3">
        {/* Header */}
        <h3 className="font-mono text-xs sm:text-sm text-amber-400 flex items-center gap-2">
          <FaCoffee className='h-3 w-3 sm:h-4 sm:w-4'/>
          COFFEE TRACKER
        </h3>

        {/* Main content */}
        <div className="flex flex-col items-center justify-center flex-1 space-y-2 sm:space-y-3">
          {/* Decrement button */}
          <button
            onClick={decrement}
            className='w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200 flex items-center justify-center active:scale-95'
            aria-label="Diminuir quantidade de café"
          >
            <FaMinus className='h-2 w-2 sm:h-3 sm:w-3'/>
          </button>

          {/* Coffee display */}
          <div className="flex flex-col items-center justify-center space-y-2 min-h-[60px]">
            {/* Coffee icons */}
            <div className="flex items-center justify-center flex-wrap gap-1 max-w-full">
              {[...Array(Math.min(coffeeCount, 5))].map((_, i) => (
                <FaCoffee key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              ))}
              {coffeeCount > 5 && (
                <span className="text-amber-400 font-mono text-sm sm:text-base ml-1">
                  +{coffeeCount - 5}
                </span>
              )}
              {coffeeCount === 0 && (
                <span className="text-gray-400 font-mono text-xs text-center">
                  No coffee yet
                </span>
              )}
            </div>

            {/* Counter text */}
            {coffeeCount > 0 && (
              <p className="text-white font-mono text-center text-xs">
                {coffeeCount} cup{coffeeCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Increment button */}
          <button
            onClick={increment}
            className='w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200 flex items-center justify-center active:scale-95'
            aria-label="Aumentar quantidade de café"
          >
            <FaPlus className='h-2 w-2 sm:h-3 sm:w-3'/>
          </button>
        </div>
      </div>
    </div>
  );
};

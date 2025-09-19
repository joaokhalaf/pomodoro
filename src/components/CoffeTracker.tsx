import { FaCoffee, FaMinus, FaPlus } from "react-icons/fa";
import useLocalStorage from "../hooks/useLocalStorage";

export const CoffeeTracker = () => {
  const [coffeeCount, setCoffeeCount] = useLocalStorage('coffeeCount', 0);

  const increment = () => setCoffeeCount(prev => prev + 1);
  const decrement = () => setCoffeeCount (prev => prev > 0 ? prev - 1: 0);

return (
  <div className="w-full max-w-xs mx-auto">
      <div className='backdrop-blur-xl bg-black/20 border border-white/10 p-4 sm:p-6 rounded-2xl shadow-2xl'>
        <div className="space-y-4">
          <h3 className="font-mono text-sm text-amber-400 flex items-center justify-center gap-2">
            <FaCoffee className='h-4 w-4 sm:h-5 sm:w-5'/>
            COFFEE TRACKER
          </h3>

          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={decrement}
              className='w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200 flex items-center justify-center active:scale-95'
              aria-label="Diminuir quantidade de café"
            >
              <FaMinus className='h-3 w-3 sm:h-4 sm:w-4'/>
            </button>

            <div className="flex flex-col items-center space-y-3 min-h-[80px] sm:min-h-[100px] justify-center">
              <div className="flex items-center justify-center flex-wrap gap-1 sm:gap-2 max-w-full">
                {[...Array(Math.min(coffeeCount, 5))].map((_, i) => (
                  <FaCoffee key={i} className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 animate-pulse" />
                ))}
                {coffeeCount > 5 && (
                  <span className="text-amber-400 font-mono text-base sm:text-lg ml-1">
                    +{coffeeCount - 5}
                  </span>
                )}
                {coffeeCount === 0 && (
                  <span className="text-gray-400 font-mono text-xs sm:text-sm text-center">
                    No coffee yet
                  </span>
                )}
              </div>

              {coffeeCount > 0 && (
                <p className="text-white font-mono text-center text-xs sm:text-sm">
                  {coffeeCount} cup{coffeeCount !== 1 ? "s" : ""} today
                </p>
              )}
            </div>

            <button
              onClick={increment}
              className='w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200 flex items-center justify-center active:scale-95'
              aria-label="Aumentar quantidade de café"
            >
              <FaPlus className='h-3 w-3 sm:h-4 sm:w-4'/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

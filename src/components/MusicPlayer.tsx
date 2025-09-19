import { useState } from 'react';
import { FaMusic, FaVolumeDown } from 'react-icons/fa';
import { FaVolumeHigh } from 'react-icons/fa6';

export const MusicPlayer = () => {

    const [showMusic, setShowMusic] = useState(false);

  return (
    <div className="backdrop-blur-xl bg-black/20 border border-white/10 p-3 sm:p-4 rounded-2xl shadow-2xl h-full flex flex-col">
      <div className="flex-1 flex flex-col space-y-3">
        <div className="flex items-center justify-between gap-2 flex-shrink-0">
          <h3 className="font-mono text-xs sm:text-sm text-purple-400 flex items-center gap-2 min-w-0">
            <FaMusic className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">MUSIC</span>
          </h3>
          <button
            onClick={() => setShowMusic(!showMusic)}
            className="text-white hover:bg-white/10 active:bg-white/20 rounded-lg px-2 py-1 sm:px-3 sm:py-2 font-mono transition-all duration-200 flex items-center gap-1 text-xs sm:text-sm flex-shrink-0"
            aria-label={showMusic ? "Ocultar player de música" : "Mostrar player de música"}
          >
            {showMusic ? (
              <FaVolumeHigh className="w-3 h-3" />
            ) : (
              <FaVolumeDown className="w-3 h-3" />
            )}
            <span className="hidden sm:inline">
              {showMusic ? "HIDE" : "SHOW"}
            </span>
          </button>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          {showMusic ? (
            <div className="aspect-video w-full rounded-lg overflow-hidden border border-white/10 bg-black/20 flex-shrink-0">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/jfKfPfyJRdk"
                title="YouTube music playlist"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
                loading="lazy"
              ></iframe>
            </div>
          ) : (
            <div className="aspect-video w-full rounded-lg overflow-hidden border border-white/10 bg-black/40 flex items-center justify-center flex-shrink-0">
              <div className="text-center px-2">
                <FaMusic className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400/50 mx-auto mb-2" />
                <p className="text-gray-400 font-mono text-xs leading-tight">
                  Click <span className="text-purple-400">SHOW</span> to play
                </p>
              </div>
            </div>
          )}

          <div className="mt-2 flex-shrink-0">
            <p className="text-xs text-gray-400 font-mono text-center leading-tight">
              Lofi beats to focus
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


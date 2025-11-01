
import React from 'react';
import { GiftIcon } from './Icons';

interface InviteTrackerProps {
  inviteCount: number;
  invitesNeeded: number;
  onInvite: () => void;
}

const InviteTracker: React.FC<InviteTrackerProps> = ({ inviteCount, invitesNeeded, onInvite }) => {
  const unlocked = inviteCount >= invitesNeeded;

  return (
    <div className="mt-8 p-4 rounded-2xl border border-white/10 bg-black/20 text-center">
      <h3 className="font-bold text-xl flex items-center justify-center gap-2">
        <GiftIcon />
        <span>فال‌های ویژه</span>
      </h3>
      {unlocked ? (
        <p className="mt-2 text-green-400">
          تبریک! فال قهوه و تاروت برای شما باز شد. 🎁
        </p>
      ) : (
        <>
          <p className="mt-2 text-indigo-300">
            برای باز کردن فال قهوه و تاروت، {invitesNeeded} نفر را دعوت کنید.
          </p>
          <div className="w-full bg-gray-700 rounded-full h-2.5 my-4">
            <div 
              className="bg-purple-500 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${(inviteCount / invitesNeeded) * 100}%` }}
            ></div>
          </div>
          <p className="font-bold text-lg mb-4">{inviteCount} / {invitesNeeded}</p>
          <button
            onClick={onInvite}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            دریافت لینک دعوت
          </button>
        </>
      )}
    </div>
  );
};

export default InviteTracker;

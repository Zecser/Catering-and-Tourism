import React from "react";

const SuccessInNumbers: React.FC = () => {
  return (
    <section className="w-full px-4 py-10 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto text-center space-y-6">
        
      </div>

      <h2 className="text-center text-2xl md:text-3xl font-semibold text-vivid-pink mt-10">
        Success in Numbers
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10 max-w-4xl mx-auto text-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 bg-vivid-pink"></div>
          <h3 className="text-2xl font-normal text-vivid-pink">1347</h3>
          <p className="uppercase text-sm tracking-wide text-vivid-pink">Programs</p>
        </div>

    <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-vivid-pink"></div>
          <h3 className="text-2xl font-normal text-vivid-pink">500</h3>
          <p className="uppercase text-sm tracking-wide text-vivid-pink">Locations</p>
        </div>

        <div className="flex flex-col items-center space-y-3">
          <div
            className="w-0 h-0 border-l-[32px] border-r-[32px] border-b-[64px] 
            border-l-transparent border-r-transparent border-vivid-pink"
          ></div>
          <h3 className="text-2xl font-normal text-vivid-pink">50–60</h3>
          <p className="uppercase text-sm tracking-wide text-vivid-pink">Volunteers</p>
        </div>
      </div>
    </section>
  );
};

export default SuccessInNumbers;

import React from 'react';
import Image from "next/image";

function Hero() {
    return (
        <div>
            <Image
                src="/img/desk1.png"
                width={950} // use the actual image width
                height={128} // use the actual image height
                alt="Desktop"
                quality={100} // highest quality
                className=" w-screen h-auto hidden md:block" />
            {/*/mobile image*/}
            <Image
                src="/img/desktop.png"
                width={400}
                height={200}
                alt="Mobile"
                quality={100}
                className="object-contain w-screen h-auto block md:hidden"
            />
        </div>
    );
}
export default Hero;
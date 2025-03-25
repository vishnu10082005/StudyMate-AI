import BackgroundImage from "../../public/BgM.png";
import MainPage from "./(appcomponents)/MainPage/page";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen flex justify-center items-center overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-no-repeat bg-center bg-cover"
          style={{
            backgroundImage: `url(${BackgroundImage.src})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 backdrop-blur-[1px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <MainPage />
      </div>
    </div>
  );
}

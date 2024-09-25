import './Loading.css';
import NotcoinImage from '../../public/image/cp.png'; // Adjust the path

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loadingspinner">
        <div className="coin" style={{ backgroundImage: `url(${NotcoinImage})` }}></div>
      </div>
    </div>
  );
};

export default Loading;

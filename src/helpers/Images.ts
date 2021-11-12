import axios from 'axios';

const fetchRandomImage = async (): Promise<any> => {
  const response = await axios.get('https://picsum.photos/300/300.jpg', {  responseType: "arraybuffer" });
  return `data:image/jpeg;base64,${Buffer.from(response.data, "binary").toString("base64")}`;
}

export default fetchRandomImage;

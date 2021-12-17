const apiConfig = {
  baseUrl: "https://api.themoviedb.org/3/",
  apiKey: "f999d53d31144634d1db3a751171d95f",
  originalImage: imgPath => `https://image.tmdb.org/t/p/original/${imgPath}`,
  w500Image: imgPath => `https://image.tmdb.org/t/p/w500/${imgPath}`,
};

export default apiConfig;

export const useCloudinary = () => {
  type CloudinaryResponse = {
    secure_url: string;
  };
  const { $config } = useNuxtApp();
  const uploadCloudinary = async (image: File): Promise<string | undefined> => {
    const formData = new FormData();
    formData.append('api_key', $config.public.cloudinaryConfig.apiKey);
    formData.append(
      'upload_preset',
      $config.public.cloudinaryConfig.uploadPreset,
    );
    formData.append('file', image);
    try {
      const response = await $fetch<Promise<CloudinaryResponse | undefined>>(
        `https://api.cloudinary.com/v1_1/${$config.public.cloudinaryConfig.uploadPreset}/image/upload`,
        {
          method: 'POST',
          body: formData,
        },
      );

      console.log('Upload cloudinary successfully', response);
      return response?.secure_url;
    } catch (error) {
      console.log('Error upload cloudinary:', error);
    }
  };

  // const validateURL = async (url: string): Promise<string | undefined> => {
  //   try {
  //     await $fetch(url, {
  //       method: 'GET',
  //     });
  //     return url;
  //   } catch (error) {
  //     console.log(error);
  //     return DEFAULT_AVATAR as string;
  //   }
  // };

  return { uploadCloudinary };
};

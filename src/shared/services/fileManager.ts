import recursiveReadDir from 'recursive-readdir';

export const getFilesFromPath = async (path: string) => {
  return await recursiveReadDir(path)
    .then((result) => {
      return result;
    })
    .catch((e) => console.log({ e }));
};

// export const removeFile =

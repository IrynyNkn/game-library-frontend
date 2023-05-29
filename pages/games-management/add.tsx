import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from '/styles/pages/games-management/Add.module.scss';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import { ageRestrictions } from '../../utils/consts';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { TbFileUpload } from 'react-icons/tb';
import {
  GameDataType,
  GameFormType,
  GenreType,
  PlatformsType,
  PublisherType,
} from '../../utils/types/games';
import { useLoading } from '../../utils/hooks/useLoading';
import { BiImageAdd } from 'react-icons/bi';
import { useDropzone } from 'react-dropzone';
import { GetServerSideProps } from 'next';
import { toast } from 'react-toastify';
import { selectStyles } from '../../utils';
import { useRouter } from 'next/router';
import getCookies from '../../utils/getCookies';
import { authTokenName } from '../../utils/auth';

type AddGameProps = {
  platforms: PlatformsType[] | null;
  genres: GenreType[] | null;
  publishers: PublisherType[] | null;
  gameData: GameDataType;
};

const Add = ({ platforms, genres, publishers, gameData }: AddGameProps) => {
  const {
    query: { gameId },
    push,
  } = useRouter();
  const { setLoading } = useLoading();
  const [selectedImage, setSelectedImage] = useState<File | null | undefined>();
  const [preview, setPreview] = useState<string>();
  const platformsOptions = useMemo(() => {
    return platforms
      ? platforms.map((plt) => ({
          value: plt.id,
          label: plt.name,
        }))
      : [];
  }, [platforms]);
  const genresOptions = useMemo(() => {
    return genres
      ? genres?.map((genre) => ({
          value: genre.id,
          label: genre.name,
        }))
      : [];
  }, [genres]);
  const publishersOptions = useMemo(() => {
    return publishers
      ? publishers.map((publisher) => ({
          value: publisher.id,
          label: publisher.name,
        }))
      : [];
  }, [publishers]);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<GameFormType>({
    defaultValues: gameData
      ? {
          title: gameData.title,
          description: gameData.description,
          publisherId: gameData.publisher.id,
          ageRestriction: gameData.ageRestriction.toString(),
          releaseYear: gameData.releaseYear.toString(),
          gameImage: 'filled',
          platforms: gameData.platforms.map((plt) => ({
            value: plt.id,
            label: plt.name,
          })),
          genres: gameData.genres.map((genre) => ({
            value: genre.id,
            label: genre.name,
          })),
        }
      : {},
  });

  useEffect(() => {
    if (!selectedImage) {
      setPreview(gameData?.imageLink || undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedImage);
    setValue('gameImage', 'filled', {shouldValidate: true});
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  const onDrop = useCallback((acceptedFiles: any[]) => {
    acceptedFiles.forEach((file) => {
      setSelectedImage(file);
    });
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'image/jpeg': [],
      'image/png': []
    }
  });
  console.log('selectedImage', selectedImage)
  const onSubmit = async (data: GameFormType) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('file', selectedImage as never as Blob);
    formData.append('publisherId', data.publisherId);
    formData.append('ageRestriction', data.ageRestriction);
    formData.append('releaseYear', data.releaseYear);
    // formData.append(
    //   'genres',
    //   JSON.stringify(data.genres.map((genre) => genre.label))
    // );
    // formData.append(
    //   'platforms',
    //   JSON.stringify(data.platforms.map((plt) => plt.label))
    // );
    for (let genre of data.genres) {
      formData.append('genres', genre.label);
    }
    for (let plt of data.platforms) {
      formData.append('platforms', plt.label);
    }

    let reqMethod: 'POST' | 'PATCH' = 'POST';
    if (gameId) {
      reqMethod = 'PATCH';
    }

    const accessToken = getCookies(authTokenName);

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/games${reqMethod === 'PATCH' ? '/' + gameId : ''}`,
        {
          method: reqMethod,
          body: formData,
          headers: {
            Authorization: `${accessToken}`,
          },
        }
      );
      const result = await response.json();

      if (result.data) {
        toast.success(
          `Game is successfully ${reqMethod === 'POST' ? 'created' : 'edited'}`
        );
        await push('/games-management');
      } else {
        const errorMsg =
          typeof result.message === 'string'
            ? result.message
            : result.message[0];
        toast.error(errorMsg || 'Oops, something went wrong');
      }
    } catch (e) {
      toast.error('Error while creating game');
      console.log('Error while creating game', e);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e?.target?.files?.[0];
    setSelectedImage(image);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Add Game</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <label
          className={`${styles.inputWrapper} ${
            errors?.title ? styles.error : ''
          }`}>
          <p className={styles.inputLabel}>Title</p>
          <input
            placeholder={'Title'}
            className={styles.input}
            {...register('title', {
              required: true,
            })}
          />
        </label>
        <div
          className={`${styles.inputWrapper} ${
            errors?.publisherId ? styles.error : ''
          }`}>
          <p className={styles.inputLabel}>Publisher</p>
          <Controller
            control={control}
            name={'publisherId'}
            rules={{ required: true }}
            render={({ field: { value, onChange, ref } }) => (
              <Select
                ref={ref}
                options={publishersOptions}
                placeholder={'Publisher'}
                value={publishersOptions.find((c) => c.value === value)}
                onChange={(val) => onChange(val?.value)}
                styles={selectStyles(!!errors?.publisherId)}
              />
            )}
          />
        </div>
        <div
          className={`${styles.inputWrapper} ${
            errors?.genres ? styles.error : ''
          }`}>
          <p className={styles.inputLabel}>Genres</p>
          <Controller
            control={control}
            name={'genres'}
            rules={{ required: true }}
            render={({ field: { value, onChange, ref } }) => (
              <Select
                ref={ref}
                options={genresOptions}
                placeholder={'Genres'}
                isMulti={true}
                value={value}
                onChange={onChange}
                styles={{
                  ...selectStyles(!!errors?.genres),
                  multiValue: (baseStyles: any) => ({
                    ...baseStyles,
                    backgroundColor: 'transparent',
                    border: '1.5px solid #39988f',
                    borderRadius: 15,
                    color: '#39988f',
                    '& div:last-child:hover': {
                      backgroundColor: 'transparent',
                    },
                  }),
                }}
              />
            )}
          />
        </div>
        <div
          className={`${styles.inputWrapper} ${
            errors?.platforms ? styles.error : ''
          }`}>
          <p className={styles.inputLabel}>Platforms</p>
          <Controller
            control={control}
            name={'platforms'}
            rules={{ required: true }}
            render={({ field: { value, onChange, ref } }) => (
              <Select
                ref={ref}
                options={platformsOptions}
                placeholder={'Platforms'}
                isMulti={true}
                value={value}
                onChange={onChange}
                styles={{
                  ...selectStyles(!!errors?.platforms),
                  multiValue: (baseStyles: any) => ({
                    ...baseStyles,
                    backgroundColor: 'transparent',
                    border: '1.5px solid #39988f',
                    borderRadius: 15,
                    color: '#39988f',
                    '& div:last-child:hover': {
                      backgroundColor: 'transparent',
                    },
                  }),
                }}
              />
            )}
          />
        </div>
        <div
          className={`${styles.inputWrapper} ${
            errors?.ageRestriction ? styles.error : ''
          }`}>
          <p className={styles.inputLabel}>Age Restriction</p>
          <Controller
            control={control}
            name={'ageRestriction'}
            rules={{ required: true }}
            render={({ field: { value, onChange, ref } }) => (
              <Select
                ref={ref}
                options={ageRestrictions}
                placeholder={'Age Restriction'}
                value={ageRestrictions.find((c) => c.value === value)}
                onChange={(val) => onChange(val?.value)}
                styles={selectStyles(!!errors?.ageRestriction)}
              />
            )}
          />
        </div>
        <div className={`${styles.inputWrapper} ${
          errors?.gameImage ? styles.error : ''
        }`}>
          <p className={styles.inputLabel}>Game Image</p>
          <div {...getRootProps({ className: 'drop-zone' })}>
            <input
              type="file"
              accept=".jpeg,.jpg,.png"
              {...register('gameImage', {
                required: true,
              })}
              {...getInputProps()}
            />
            {preview ? (
              <img
                className={styles.uploadedImg}
                src={preview}
                alt={'uploaded-image'}
              />
            ) : (
              <>
                <BiImageAdd size={32} />
                <p className={styles.dropzoneText}>Drag 'n' drop image</p>
              </>
            )}
          </div>
          <label className={styles.fileInput}>
            <input
              type="file"
              accept=".jpeg,.jpg,.png"
              onChange={uploadImage}
            />
            {selectedImage ? (
              <>
                <IoMdCheckmarkCircleOutline size={20} className={styles.icon} />
                {selectedImage.name}
              </>
            ) : (
              <>
                <TbFileUpload size={20} className={styles.icon} />
                Upload Game Image
              </>
            )}
          </label>
          {
            errors?.gameImage && <p className={styles.errorMsg}>Game image can't be empty</p>
          }
        </div>
        <label
          className={`${styles.inputWrapper} ${
            errors?.releaseYear ? styles.error : ''
          }`}>
          <p className={styles.inputLabel}>Release Year</p>
          <input
            placeholder={'Release Year'}
            className={styles.input}
            type="number"
            {...register('releaseYear', {
              required: true,
              min: 1900,
              max: 2022,
            })}
          />
        </label>
        <div
          className={`${styles.inputWrapper} ${
            errors?.description ? styles.error : ''
          }`}>
          <p className={styles.inputLabel}>Description</p>
          <textarea
            rows={7}
            placeholder={'Description'}
            className={styles.textarea}
            {...register('description', {
              required: true,
            })}></textarea>
        </div>
        <button type={'submit'} className={'green-button'}>
          Submit Game
        </button>
      </form>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  let platforms = null;
  let genres = null;
  let publishers = null;
  let gameData = null;

  try {
    const accessToken = context.req.cookies.GamelyAuthToken;
    const gameId = context.query.gameId;
    const resPlatforms = await fetch(`${process.env.API_URL}/platforms`, {
      headers: {
        Authorization: `${accessToken}`,
      },
    });
    const resPublishers = await fetch(`${process.env.API_URL}/publishers`, {
      headers: {
        Authorization: `${accessToken}`,
      },
    });
    const resGenres = await fetch(`${process.env.API_URL}/genres`, {
      headers: {
        Authorization: `${accessToken}`,
      },
    });
    if (gameId) {
      const resGameData = await fetch(`${process.env.API_URL}/games/${gameId}`, {
        headers: {
          Authorization: `${accessToken}`,
        },
      });
      gameData = await resGameData.json();
    }
    platforms = await resPlatforms.json();
    genres = await resGenres.json();
    publishers = await resPublishers.json();
  } catch (e) {
    console.log('Error while fetching data for Add page', e);
  }

  return {
    props: {
      platforms: platforms?.data ?? [],
      genres: genres?.data ?? [],
      publishers: publishers?.data ?? [],
      gameData: gameData?.data || gameData,
    },
  };
};

export default Add;

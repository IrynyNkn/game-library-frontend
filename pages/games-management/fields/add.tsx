import React from 'react';
import { useRouter } from 'next/router';
import styles from '/styles/pages/games-management/Add.module.scss';
import { useLoading } from '../../../utils/hooks/useLoading';
import { useForm } from 'react-hook-form';
import { GameFieldsFormType } from '../../../utils/types/games';
import { toast } from 'react-toastify';
import { GetServerSideProps } from 'next';

type AddFieldType = {
  fieldData: {
    id: string;
    name: string;
  } | null;
};

const AddField = ({ fieldData }: AddFieldType) => {
  const {
    query: { fieldType, fieldId },
    push,
  } = useRouter();
  const { setLoading } = useLoading();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GameFieldsFormType>({
    defaultValues: fieldData
      ? {
          name: fieldData.name,
        }
      : {},
  });

  const getLabel = () => {
    switch (fieldType) {
      case 'genres':
        return 'Genre';
      case 'platforms':
        return 'Platform';
      case 'publishers':
        return 'Publisher';
      default:
        return '';
    }
  };

  const onSubmit = async (data: GameFieldsFormType) => {
    setLoading(true);
    const reqMethod = fieldId && fieldData ? 'PATCH' : 'POST';

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/${fieldType}${reqMethod === 'PATCH' ? '/' + fieldId : ''}`,
        {
          method: reqMethod,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();

      if (!result.error) {
        toast.success(result.message);
        await push(`/${fieldType}`);
      } else {
        toast.error(result.message);
      }
    } catch (e) {
      console.log(
        `Error on ${reqMethod === 'PATCH' ? 'editing' : 'creating'} genre`,
        e
      );
      toast.error('Internal Server Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {fieldId ? 'Edit' : 'Add'} {getLabel()}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <label
          className={`${styles.inputWrapper} ${
            errors?.name ? styles.error : ''
          }`}>
          <p className={styles.inputLabel}>Name</p>
          <input
            placeholder={'Name'}
            className={styles.input}
            {...register('name', {
              required: true,
            })}
          />
        </label>
        <button type={'submit'} className={'green-button'}>
          Submit {getLabel()}
        </button>
      </form>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  let fieldData = null;
  const fieldType = query.fieldType;
  const fieldId = query.fieldId;
  const accessToken = req.cookies.GamelyAuthToken;

  try {
    if (fieldId) {
      const resGenres = await fetch(`${process.env.API_URL}/${fieldType}/${fieldId}`, {
        headers: {
          Authorization: `${accessToken}`,
        },
      });
      const result = await resGenres.json();

      if (result.data) {
        fieldData = result.data;
      }
    }
  } catch (e) {
    console.log(e);
  }

  return {
    props: {
      fieldData,
    },
  };
};

export default AddField;

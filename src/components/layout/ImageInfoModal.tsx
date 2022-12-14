import React, { useRef } from 'react';
import { FavoriteBorder, PhotoCamera, ThumbUp } from '@mui/icons-material';
import { HeightIcon, WidthIcon } from '../Icons';
import { TextField, Button } from '@mui/material';
import { useAppSelector } from '../../app/hooks';
import { downloadImgFetch } from '../../utils';

import styles from './ImageInfoModal.module.css';

type ModalState = {
  onSubmitFormHandler: (e: React.FormEvent, inputValue: string) => void;
  onDeleteFavBtn: (id: string) => void;
};

export const ImageInfoModal: React.FC<ModalState> = ({
  onSubmitFormHandler,
  onDeleteFavBtn,
}) => {
  const favedPhotos = useAppSelector((state) => state.favourite.favedImages);
  const modalPhoto = useAppSelector((state) => state.modal.imgToDisplay);
  const isModalDescription = useAppSelector((state) => state.modal.description);
  const modalPhotoUrl = useAppSelector((state) => state.modal.url);
  const descriptionInput = useRef<HTMLInputElement>(null);

  const isImgFaved = () => {
    const checkingForFavedImg = favedPhotos.find(
      (imgObj) => imgObj.id === modalPhoto.id
    );
    return !!checkingForFavedImg;
  };

  const downloadBtnHandler = (url: string, description: string | undefined) => {
    downloadImgFetch(url, description);
  };

  return (
    <div className={styles['modal-container']}>
      <div className={styles['modal-container-flex']}>
        <div className={styles['modal-container-img']}>
          <a href={modalPhoto.urls.full} target='_blank'>
            <img
              className={
                modalPhoto.width > modalPhoto.height
                  ? styles['img-is-wider']
                  : ''
              }
              style={{
                maxWidth: '100%',
                maxHeight: '57vh',
                borderRadius: '15px',
              }}
              src={modalPhotoUrl ? modalPhotoUrl : modalPhoto.urls.small}
            />
          </a>
        </div>
        <div>
          <fieldset className={styles['description-container']}>
            <legend>
              <i>
                {!isImgFaved()
                  ? 'Description'
                  : isModalDescription
                  ? `Photo already saved, change description...`
                  : 'Photo already saved on favs'}
              </i>
            </legend>
            <>
              {modalPhoto?.description && (
                <div className='tooltip'>
                  <b>{`${modalPhoto.description.substring(0, 80)}${
                    modalPhoto.description.length > 80 ? `...` : ``
                  }`}</b>
                  <span className='tooltiptext'>{modalPhoto.description}</span>
                </div>
              )}
            </>
            {!isModalDescription && isImgFaved() ? (
              <span></span>
            ) : (
              <form
                onSubmit={(e) =>
                  onSubmitFormHandler(e, descriptionInput.current!.value)
                }
                className={styles['description-form']}
              >
                <TextField
                  className={styles['description-input']}
                  id='input'
                  label='Add description'
                  variant='standard'
                  color='primary'
                  size='small'
                  inputRef={descriptionInput}
                />
                <button
                  type='submit'
                  className={styles['description-like-btn']}
                >
                  <FavoriteBorder fontSize='large' />
                </button>
              </form>
            )}
            <div className={styles['btn-delete-download-container']}>
              {isImgFaved() && (
                <Button
                  onClick={() => onDeleteFavBtn(modalPhoto.id)}
                  variant='outlined'
                  color='error'
                >
                  delete
                </Button>
              )}
              <Button
                className={styles['btn-download']}
                onClick={() =>
                  downloadBtnHandler(
                    modalPhoto.download,
                    modalPhoto?.description
                  )
                }
                variant='contained'
                color='success'
              >
                download
              </Button>
            </div>
          </fieldset>
          <fieldset className={styles['info-container']}>
            <legend>Added to fav {modalPhoto.timeSaved}H</legend>
            <ul className={styles['details-list']}>
              <li>
                <PhotoCamera />{' '}
                <a
                  href={modalPhoto.author.link ? modalPhoto.author.link : '#'}
                  target='_blank'
                >
                  {modalPhoto.author.name} @Unsplash
                </a>
              </li>
              <li>
                <ThumbUp /> {modalPhoto.likes}
              </li>
              <li>
                <WidthIcon /> {modalPhoto.width} px
              </li>
              <li>
                <HeightIcon /> {modalPhoto.height} px
              </li>
            </ul>
          </fieldset>
        </div>
      </div>
    </div>
  );
};

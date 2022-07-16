import { useState, useEffect, useRef } from 'react';
import { searchingApi } from '../imagesApi/imagesApi';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import Modal from './Modal/Modal';
import { Button } from './Button/Button';
import { TailSpin } from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import styles from 'components/App.module.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { notifyWarning, notifyError, notifyInfo } from 'utils';

export default function App() {
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [largeImageURL, setLargeImageURL] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState(false);
  const [totalImages, setTotalImages] = useState(null);
  const timeoutId = useRef(null);

  useEffect(() => {
    if (searchQuery === '') {
      return;
    }
    const searchImages = async () => {
      try {
        const { hits, totalHits } = await searchingApi(searchQuery, page);

        setImages(state => [...state, ...hits]);
        setTotalImages(totalHits);
        setStatus(false);
      } catch (error) {
        notifyError('Something went wrong, please reload the page.');
      }
    };
    searchImages();
  }, [page, searchQuery]);

  useEffect(() => {
    totalImages === images.length &&
      page !== 1 &&
      notifyInfo("We're sorry, but you've reached the end of search results.");
  }, [totalImages, images.length, page]);

  useEffect(() => {
    totalImages === 0 &&
      notifyWarning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
  }, [totalImages]);

  useEffect(() => {
    if (page !== 1) {
      timeoutId.current = setTimeout(() => {
        windowScroll();
      }, 200);
    }

    return () => {
      clearTimeout(timeoutId.current);
    };
  }, [page]);

  const windowScroll = () => {
    const { height: cardHeight } = document
      .querySelector(`.${styles.imageGalleryBox}`)
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  };

  const handleFormSubmit = evt => {
    evt.preventDefault();

    const { query } = evt.target.elements;

    setPage(1);
    setImages([]);
    setSearchQuery(query.value.trim());
    setStatus(true);

    if (query.value.trim() === '') {
      notifyWarning("You haven't entered anything.");
    }
  };

  const loadMore = () => {
    setPage(state => state + 1);
    setStatus(true);
  };

  const openModal = img => {
    setLargeImageURL(img);
    setIsModalOpen(true);
  };

  const closeModal = evt => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.app}>
      <Searchbar onSubmit={handleFormSubmit} />
      {status && searchQuery !== '' && page === 1 && (
        <div className={styles.spinner}>
          <TailSpin color="#00BFFF" height={80} width={80} />
        </div>
      )}
      {images.length > 0 && (
        <div className={styles.imageGalleryBox}>
          <ImageGallery
            images={images}
            onOpenModal={openModal}
            onLoadMore={loadMore}
          />
          {status && totalImages > 0 && (
            <div className={styles.spinner}>
              <TailSpin color="#00BFFF" height={80} width={80} />
            </div>
          )}
          {totalImages !== images.length && <Button onLoadMore={loadMore} />}
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {isModalOpen && <Modal url={largeImageURL} onCloseModal={closeModal} />}
    </div>
  );
}

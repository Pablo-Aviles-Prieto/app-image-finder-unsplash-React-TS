import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { fetchCategories } from '../components/store/searchSlice';
import { useQuery } from '../utils';
import {
  FavedImgsContainer,
  GridImages,
  MainContainer,
  MainContainerCard,
  SearchInput,
} from '../components';

const dummyInputHandler = () => {};
const dummyClickFavHandler = () => {};

export const LandPage: React.FC = () => {
  const [pageState, setPageState] = useState('1');
  const photos = useAppSelector((state) => state.search.unsplashData);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryCategories = useQuery().get('cats');
  const queryPage = useQuery().get('page');

  useEffect(() => {
    if (queryCategories) {
      dispatch(
        fetchCategories({
          url: `https://api.unsplash.com/search/collections/?per_page=30&page=${
            queryPage ? queryPage : '1'
          }&query=${queryCategories}`,
          updateTotalPages: true,
        })
      );
      setPageState((prevState) => {
        if (queryPage) {
          return prevState === queryPage ? prevState : queryPage;
        }
        return prevState;
      });
      return;
    }
    dispatch(
      fetchCategories({
        url: `https://api.unsplash.com/collections/?per_page=30&page=${
          queryPage ? queryPage : '1'
        }`,
        updateTotalPages: true,
      })
    );
    setPageState((prevState) => {
      if (queryPage) {
        return prevState === queryPage ? prevState : queryPage;
      }
      return prevState;
    });
  }, [dispatch, queryCategories, queryPage, setPageState]);

  const pageChangeHandler = (page: number) => {
    setPageState(`${page}`);
  };

  const clickImgHandler = (id: string) => {
    const image = photos.parsedArray.find((obj) => obj.id === id);
    navigate(`/search?imgscat=${id}&catname=${image?.description}`);
    document.getElementById('container-imgs-title')?.scrollIntoView();
  };

  const submitFormHandler = (e: React.FormEvent, inputValue: string) => {
    e.preventDefault();
    const enteredSearch = inputValue.trim();
    if (enteredSearch) {
      const parsedSearch = enteredSearch.replace(/(\s)+/g, '%20');
      navigate(`/?cats=${parsedSearch}&page=1`);
    }
  };

  const titleToDisplay = useMemo(
    () =>
      queryCategories
        ? `Searching the categories: ${queryCategories}`
        : 'Browse around this unsplash categories',
    [queryCategories]
  );

  return (
    <>
      <MainContainer sectionTitle={titleToDisplay}>
        <>
          <SearchInput
            placeholderText='Search categories...'
            onSubmitFormHandler={submitFormHandler}
            onChangeInputHandler={dummyInputHandler}
          />
          <MainContainerCard>
            <FavedImgsContainer />
          </MainContainerCard>
        </>
      </MainContainer>
      <GridImages
        forceBarDisplaying={true}
        pageState={pageState}
        onClickImgHandler={clickImgHandler}
        onClickFavIcon={dummyClickFavHandler}
        onPageChange={pageChangeHandler}
      />
    </>
  );
};

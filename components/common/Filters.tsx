import React, { useEffect, useRef, useState } from 'react';
import styles from '../../styles/components/Filters.module.scss';
import { FaFilter } from 'react-icons/fa';
import clickAwayListener from '../../utils/hooks/clickAwayListener';
import {
  AppliedFilterType,
  FilterCategoriesType,
  FilterTagType,
} from '../../utils/types/filter';
import usePlatforms from '../../utils/hooks/usePlatforms';
import useGenres from '../../utils/hooks/useGenres';
import usePublishers from '../../utils/hooks/usePublishers';
import { useRouter } from 'next/router';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

const Filters = () => {
  const router = useRouter();
  const [currentFilter, setCurrentFilter] =
    useState<FilterCategoriesType | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilterType[]>([]);
  const [filtersIds, setFiltersIds] = useState<string[]>([]);
  const filtersRef = useRef(null);
  const { data: platformsData } = usePlatforms();
  const { data: genresData } = useGenres();
  const { data: publishersData } = usePublishers();

  const filtersCategories = [
    {
      label: 'Genres',
      tags: genresData?.length ? genresData : [],
    },
    {
      label: 'Platforms',
      tags: platformsData?.length ? platformsData : [],
    },
    {
      label: 'Publishers',
      tags: publishersData?.length ? publishersData : [],
    },
  ];

  const onTagClick = (filter: FilterTagType) => {
    const filters = [...appliedFilters];
    const currentAppliedFilter = filters.find(
      (flt) => flt.label === currentFilter?.label
    ); // exists with a label
    const index = filters.findIndex(
      (flt) => flt.label === currentFilter?.label
    ); // index of label (array's element)

    if (currentAppliedFilter) {
      if (currentAppliedFilter.tags.includes(filter.id)) {
        // tag exists and needs to be deleted
        currentAppliedFilter.tags = currentAppliedFilter.tags.filter(
          (flt) => flt !== filter.id
        );
        if (currentAppliedFilter.tags.length === 0) {
          filters.splice(index, 1);
        } else {
          filters[index] = currentAppliedFilter;
        }
        setAppliedFilters(filters);
      } else {
        currentAppliedFilter.tags.push(filter.id);
        filters[index] = currentAppliedFilter;
        setAppliedFilters(filters);
      }
    } else {
      const appliedFilter = {
        label: currentFilter?.label as string,
        tags: [filter.id],
      };
      setAppliedFilters([...appliedFilters, appliedFilter]);
    }
  };

  const filterIsClicked = (filter: FilterTagType): boolean => {
    const currentAppliedFilter = appliedFilters.find(
      (flt) => flt.label === currentFilter?.label
    );
    if (currentAppliedFilter) {
      if (currentAppliedFilter.tags.includes(filter.id)) {
        return true;
      }
    }

    return false;
  };

  const filterApplied = (filter: FilterTagType): boolean =>
    filtersIds.includes(filter.id);

  const applyFilters = async () => {
    let queryStr = '';
    // @ts-ignore
    for (let [idx, flt] of appliedFilters.entries()) {
      const paramName = flt.label.toLowerCase();
      const paramVal = flt.tags.join(',');
      const query = `${idx === 0 ? '?' : '&'}${paramName}=${paramVal}`;

      queryStr = queryStr + query;
    }
    await router.push(`/${queryStr}`);
  };

  const resetFilters = async () => {
    setAppliedFilters([]);
    setCurrentFilter(null);
    await router.push('/');
  };

  const parseFiltersFromUrl = (
    genresStr: undefined | string,
    platformsStr: undefined | string,
    publishersStr: undefined | string
  ): AppliedFilterType[] => {
    const genresIds = genresStr ? genresStr.split(',') : null;
    const platformsIds = platformsStr ? platformsStr.split(',') : null;
    const publishersIds = publishersStr ? publishersStr.split(',') : null;

    const genres =
      genresIds && genresData
        ? genresData.filter((genre) => genresIds.includes(genre.id))
        : [];
    const platforms =
      platformsIds && platformsData
        ? platformsData.filter((plt) => platformsIds.includes(plt.id))
        : [];

    const publishers =
      publishersIds && publishersData
        ? publishersData.filter((pub) => publishersIds.includes(pub.id))
        : [];

    const filters = [];
    if (genres.length) {
      filters.push({
        label: 'Genres',
        tags: genres.map((genre) => genre.id),
      });
    }
    if (platforms.length) {
      filters.push({
        label: 'Platforms',
        tags: platforms.map((plt) => plt.id),
      });
    }
    if (publishers.length) {
      filters.push({
        label: 'Publishers',
        tags: publishers.map((pub) => pub.id),
      });
    }

    return filters;
  };

  const getFiltersIdsFromUrl = (
    genresStr: undefined | string,
    platformsStr: undefined | string,
    publishersStr: undefined | string
  ) => {
    let idsArray: string[] = [];
    const genresIds = genresStr ? genresStr.split(',') : [];
    const platformsIds = platformsStr ? platformsStr.split(',') : [];
    const publishersIds = publishersStr ? publishersStr.split(',') : [];

    idsArray = idsArray
      .concat(genresIds)
      .concat(platformsIds)
      .concat(publishersIds);
    return idsArray;
  };

  const filtersMatch = (): boolean => {
    let mergedAppliedFlts: string[] = [];
    appliedFilters.forEach((flt) => {
      mergedAppliedFlts = mergedAppliedFlts.concat(flt.tags);
    });

    return JSON.stringify(mergedAppliedFlts) === JSON.stringify(filtersIds);
  };

  useEffect(() => {
    const {
      query: { genres, platforms, publishers },
    } = router;
    const currentFilters = parseFiltersFromUrl(
      genres as string,
      platforms as string,
      publishers as string
    );
    setAppliedFilters(currentFilters);
    const idsArray = getFiltersIdsFromUrl(
      genres as string,
      platforms as string,
      publishers as string
    );
    setFiltersIds(idsArray);
  }, [router]);

  const showFilterActivityBadge = (categoryLabel: string): boolean => {
    switch (categoryLabel) {
      case 'Genres':
        return !!router.query.genres;
      case 'Platforms':
        return !!router.query.platforms;
      case 'Publishers':
        return !!router.query.publishers;
      default:
        return false;
    }
  };

  clickAwayListener(filtersRef, !!currentFilter, () => setCurrentFilter(null));

  return (
    <>
      <section ref={filtersRef} className={styles.filterSection}>
        <div className={styles.container}>
          <div className={styles.label}>
            <FaFilter />
            <p>Filter By</p>
          </div>
          {filtersCategories.map((category, idx) => {
            const isActive =
              currentFilter && currentFilter.label === category.label;
            return (
              <button
                key={idx}
                className={`${styles.filterButton} ${
                  isActive && styles.active
                }`}
                onClick={() => setCurrentFilter(category)}>
                <span
                  className={
                    showFilterActivityBadge(category.label)
                      ? styles.withFilter
                      : ''
                  }>
                  {category.label}
                </span>
              </button>
            );
          })}
          {!!filtersIds.length && (
            <button
              className={`${styles.filterButton} ${styles.resetBtn}`}
              onClick={resetFilters}>
              Clear Filters
            </button>
          )}
        </div>
        <div
          className={`${styles.filtersModal} ${
            currentFilter ? styles.modalOpen : ''
          }`}>
          <p className={styles.tagsLabel}>Tags</p>
          <ul className={styles.tagContainer}>
            {currentFilter &&
              currentFilter.tags.map((filter, idx) => (
                <li
                  onClick={() => onTagClick(filter)}
                  key={idx}
                  className={`${styles.filterTag} ${
                    filterIsClicked(filter) ? styles.active : ''
                  }`}>
                  {filterApplied(filter) ? (
                    <IoMdCheckmarkCircleOutline className={styles.checked} />
                  ) : (
                    ''
                  )}
                  {filter.name}
                </li>
              ))}
          </ul>
          {!filtersMatch() && (
            <button onClick={applyFilters} className={styles.applyBtn}>
              Apply Filters
            </button>
          )}
        </div>
      </section>
    </>
  );
};

export default Filters;

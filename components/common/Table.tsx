import React, { useEffect, useState } from 'react';
import styles from '../../styles/components/Table.module.scss';
import TableActions from './TableActions';
import { CellRenderMethodsType } from '../../utils/types/games';
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';
import ReactPaginate from 'react-paginate';
import SearchBar from './SearchBar';

type TableBodyRowType = {
  [key: string]: string | any[];
};

type TableType = {
  tableHead: string[];
  tableBody: TableBodyRowType[];
  cellRenderMethods: CellRenderMethodsType;
};

const Table = ({ tableHead, tableBody, cellRenderMethods }: TableType) => {
  const [itemOffset, setItemOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tableBodyToDraw, setTableBodyToDraw] =
    useState<TableBodyRowType[]>(tableBody);

  const itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = tableBodyToDraw.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(tableBodyToDraw.length / itemsPerPage);

  useEffect(() => {
    setTableBodyToDraw(tableBody);
    setItemOffset(0);
  }, [tableBody]);

  useEffect(() => {
    searchByQuery(searchQuery);
  }, [searchQuery]);

  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % tableBodyToDraw.length;
    setItemOffset(newOffset);
  };

  const searchByQuery = (query: string) => {
    const filteredArray = [];
    for (let row of tableBody) {
      let hasString = false;
      for (let [cellKey, cellVal] of Object.entries(row)) {
        if (cellKey !== 'id' && typeof cellVal === 'string') {
          if (cellVal.toLowerCase().includes(query.toLowerCase())) {
            hasString = true;
          }
        }
      }

      if (hasString) {
        filteredArray.push(row);
      }
    }
    setTableBodyToDraw(filteredArray);
  };

  return (
    <div>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <table className={styles.table}>
        <thead className={styles.tableHead}>
          <tr>
            {tableHead.map((thVal, key) => (
              <th key={key}>{thVal}</th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tableBody}>
          {currentItems.map((row, idx) => (
            <tr key={`row-${idx}`}>
              {Object.entries(row).map(([celKey, cellVal], cellIdx) => {
                if (celKey === 'id' || celKey === 'ID') {
                  return (
                    <td key={`cell-${cellIdx}`}>{idx + itemOffset + 1}</td>
                  );
                }

                return (
                  <td key={`cell-${cellIdx}`}>
                    {cellRenderMethods?.renderCell?.[celKey]
                      ? cellRenderMethods?.renderCell[celKey](cellVal)
                      : cellVal}
                  </td>
                );
              })}
              <td>
                <TableActions
                  onEditClick={() =>
                    cellRenderMethods.onEditClick(row.id as string)
                  }
                  onDeleteClick={() =>
                    cellRenderMethods.onDeleteClick(row.id as string)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className={styles.tableFooter}>
          <tr>
            <td className={styles.footerTd} colSpan={tableHead.length}>
              <div className={styles.footerBar}>
                <p className={styles.footerItemsCount}>
                  {itemOffset + 1} -{' '}
                  {endOffset <= tableBodyToDraw.length
                    ? endOffset
                    : endOffset - (endOffset - tableBodyToDraw.length)}{' '}
                  out of {tableBodyToDraw.length}
                </p>
                <ReactPaginate
                  containerClassName={'games-table-pagination'}
                  activeClassName={'active'}
                  breakLabel="..."
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={5}
                  pageCount={pageCount}
                  renderOnZeroPageCount={() => null}
                  pageClassName={styles.tablePage}
                  nextClassName={'arrow-label next'}
                  nextLabel={<GrFormNext style={{ fontSize: '1.5em' }} />}
                  previousClassName={'arrow-label prev'}
                  previousLabel={
                    <GrFormPrevious style={{ fontSize: '1.5em' }} />
                  }
                />
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Table;

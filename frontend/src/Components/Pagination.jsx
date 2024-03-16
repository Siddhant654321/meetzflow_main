import '../styles/pagination.css'
import ReactPaginate from 'react-paginate';

const Pagination = ({length, setArrayLength, setStartingPoint, limit}) => {
    
    const pageCount = Math.ceil(length / limit);
    
    const handlePageClick = ({ selected: selectedPage }) => {
        setStartingPoint(limit * selectedPage);
        const endingPoint = Math.min((selectedPage + 1) * limit, length);
        setArrayLength(endingPoint);
    }

    return (
        <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            previousLinkClassName={"pagination__link"}
            nextLinkClassName={"pagination__link"}
            disabledLinkClassName={"pagination__link--disabled"}
            activeLinkClassName={"pagination__link--active"}
            pageLinkClassName={'pagination__pages'}
          />
    );
}

export default Pagination
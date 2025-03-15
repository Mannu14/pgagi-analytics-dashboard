import '../styles/search.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Search({ searchQuery }) {
    const apiUrlProcess = `${window.location.origin}/apis`;
    const [showPopup, setShowPopup] = useState(true);
    const [allData, setAllData] = useState([]);
    const [loadingShowAll, setLoadingShowAll] = useState(false);
    const [error, setError] = useState(null);
    const [searchPage, setSearchPage] = useState(1);
    const [calculatedPageShowAll, setCalculatedPageShowAll] = useState(null);
    const [hasMoreShowAll, setHasMoreShowAll] = useState(true);

    const fetchData = async () => {
        if (loadingShowAll) return;
        setLoadingShowAll(true);
        setError(null);
        // console.log(searchQuery)

        try {
            const url = `${apiUrlProcess}/SearchData`;
            const params = {
                searchPage,
                searchQuery
            };
            const response = await axios.get(url, { params });
            const articles = response.data.news || [];
            setCalculatedPageShowAll(Math.ceil(response.data.totalResults / 20));
            console.log(searchPage)
            if (searchPage === 1) {
                setAllData(articles);
            } else {
                setAllData(prevNews => [...prevNews, ...articles]);
            }
            setHasMoreShowAll(articles.length > 0 && searchPage < Math.ceil(response.data.totalResults / 20));
        } catch (error) {
            setError('Data Error: ' + error.message);
        } finally {
            setLoadingShowAll(false);
        }
    };

    // useEffect(() => {
    //     fetchData();
    // }, [searchPage, searchQuery]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setAllData([]);
            setSearchPage(1);
        } else {
            fetchData();
        }
    }, [searchPage, searchQuery]);

    const handleScroll = () => {
        const contentBox = document.querySelector('.content-box-search');
        if (contentBox) {
            const { scrollTop, scrollHeight, clientHeight } = contentBox;
            if (scrollHeight - scrollTop === clientHeight && hasMoreShowAll && !loadingShowAll) {
                setSearchPage(prevPage => prevPage + 1);
            }
        }
    };

    useEffect(() => {
        const contentBox = document.querySelector('.content-box-search');
        if (contentBox) {
            contentBox.addEventListener('scroll', handleScroll);
            return () => contentBox.removeEventListener('scroll', handleScroll);
        }
    }, [loadingShowAll, hasMoreShowAll]);

    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <>
            <div className={`popup-box-search ${showPopup ? 'show' : ''}`}>
                {showPopup && (
                    <div className="popup-search">
                        <div className="content-box-search">
                            <header>
                                <p>Search data</p>
                                <i className="fa-regular fa-circle-xmark" onClick={closePopup}></i>
                            </header>
                            <form>
                                {loadingShowAll && <div className="loader"></div>}
                                {error && <p className='error'>{error}</p>}
                                {!loadingShowAll && !error && allData.length === 0 && <p className='no-found'>No results found!</p>}
                                {allData.length > 0 ? allData.map((article, index) => (
                                    <div key={index} className="row-search title-search">
                                        <Link className='row-search-Link' to='#'>
                                           {index+1} {article.title ? article.title.substring(0, 50) : ''}...
                                            <p>{article.content ? article.content.substring(0, 200) : ''}...</p>
                                        </Link>
                                    </div>
                                )) : ''}
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
export default Search;
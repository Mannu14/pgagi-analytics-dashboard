import { useState } from 'react';

const Sharebtn = ({ user }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleButtonClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="share-btn" onClick={handleButtonClick}>
      <a className={`fab fa-brands fa-linkedin-in ${isExpanded ? 'expanded' : 'compress'}`} href={`https://www.linkedin.com/shareArticle?mini=true&url=`}></a>
      <a className={`fab fa-instagram ${isExpanded ? 'expanded' : 'compress'}`} href={`https://www.instagram.com/?url=`}></a>
      <a className={`fab fa-whatsapp ${isExpanded ? 'expanded' : 'compress'}`} href={`https://api.whatsapp.com/send?text=`}></a>
      <button className={`fa fa-share-alt ${isExpanded ? 'expanded' : ''}`}></button>
    </div>
  );
};

export default Sharebtn;

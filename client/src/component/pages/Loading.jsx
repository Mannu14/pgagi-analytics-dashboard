import '../styles/loading.css'
function Loading({ stroke = '#88C5E1', width = '30px', height = '30px',ISORNOT='Loading' }) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <section className="body-LoaderP">
          <svg className="spinner" viewBox="0 0 50 50" style={{ width, height }}>
            <circle className="path" stroke={`${stroke}`} cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
          </svg>
        </section>
        <p style={{ textAlign: 'center', paddingLeft: '1px', color:{stroke},fontSize:'15px' }}>{ISORNOT}...</p>
      </div>
    </>
  );
}

export default Loading;
import style from './ModalDatosHistoricos.module.css';

const ModalDatosHistoricos = ({children,isOpen,closeModal}) => {
    return (
      <article className={`${style.modal} ${isOpen && style.isOpen}`}>
          <div className={style.modalContainer}>
              <button 
                  className={style.modalClose}
                  onClick={closeModal}
                  translate='no'
              >X</button>
              {children}
          </div>
  
      </article>
    )
  }
  
  export default ModalDatosHistoricos;
import PageHeader from '../components/PageHeader';
import notFoundImg from '../img/not_found.png';
import styles from '../css/NotFound.module.css';

function NotFound() {
  return (
    <div className={styles.container}>
      <PageHeader title="页面不存在" />
      <div className={styles.content}>
        <img src={notFoundImg} alt="404" className={styles.img} />
        <h2>抱歉，您访问的页面不存在</h2>
        <p>请检查您的网址是否正确，或返回首页</p>
      </div>
    </div>
  );
}

export default NotFound;
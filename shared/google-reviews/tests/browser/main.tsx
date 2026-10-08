import { createRoot } from 'react-dom/client';
import { GoogleReviews } from '../../react/GoogleReviews';
import '../../react/styles.css';

const params = new URLSearchParams(window.location.search);
createRoot(document.getElementById('root')!).render(<main>
  <GoogleReviews enabled={!params.has('disabled')} />
  {params.has('two') && <GoogleReviews title="Segunda instância" />}
</main>);

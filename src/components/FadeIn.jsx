import { useEffect, useState } from 'react';

export default function FadeIn({ children }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    return () => setVisible(false);
  }, []);

  return (
    <div className={`transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {children}
    </div>
  );
}

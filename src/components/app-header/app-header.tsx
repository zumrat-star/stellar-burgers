import { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUser } from '../../services/slices/authSlice';

export const AppHeader: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);

  const handleConstructorClick = () => {
    navigate('/');
  };

  const handleFeedClick = () => {
    navigate('/feed');
  };

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <AppHeaderUI
      userName={user?.name || ''}
      onConstructorClick={handleConstructorClick}
      onFeedClick={handleFeedClick}
      onProfileClick={handleProfileClick}
    />
  );
};

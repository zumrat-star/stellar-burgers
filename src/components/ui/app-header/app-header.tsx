import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({
  userName,
  onConstructorClick,
  onFeedClick,
  onProfileClick
}) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        {/* Конструктор - добавляем onClick */}
        <div
          className={styles.link}
          onClick={onConstructorClick}
          style={{ cursor: 'pointer' }}
        >
          <BurgerIcon type={'primary'} />
          <p className='text text_type_main-default ml-2 mr-10'>Конструктор</p>
        </div>

        {/* Лента заказов - добавляем onClick */}
        <div
          className={styles.link}
          onClick={onFeedClick}
          style={{ cursor: 'pointer' }}
        >
          <ListIcon type={'primary'} />
          <p className='text text_type_main-default ml-2'>Лента заказов</p>
        </div>
      </div>

      <div className={styles.logo}>
        <Logo className='' />
      </div>

      {/* Личный кабинет - добавляем onClick */}
      <div
        className={styles.link_position_last}
        onClick={onProfileClick}
        style={{ cursor: 'pointer' }}
      >
        <ProfileIcon type={'primary'} />
        <p className='text text_type_main-default ml-2'>
          {userName || 'Личный кабинет'}
        </p>
      </div>
    </nav>
  </header>
);

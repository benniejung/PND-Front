import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as S from './HeaderStyle.jsx';
import logoSrc from '../../assets/images/main-logo.png';
import altlogo from '../../assets/images/alt-profile.png';

function Header() {
    const [userImage, setUserImage] = useState(null); // 기본 이미지
    const [logined, setLogined] = useState(false);

    const location = useLocation();

    useEffect(() => {
        const userInfo = sessionStorage.getItem('userInfo');
        if (userInfo) {
            const parsedUserInfo = JSON.parse(userInfo);
            setLogined(true);
            setUserImage(parsedUserInfo.image);
        }
        else{
            //로그인 했다가 로그아웃 시를 위해
            setLogined(false);
            setUserImage(null);
        }
    }, []); 

    return (
        <S.HeaderLayout>
            <Link to='/'>
                <S.Logo src={logoSrc} alt='Logo' />
            </Link>
            <S.NavLinks>
                <Link to='/'>
                    <S.NavLink className={location.pathname === '/' ? 'active' : ''}>
                        HOME
                    </S.NavLink>
                </Link>
                <Link to='/readme'>
                    <S.NavLink className={location.pathname === '/readme' ? 'active' : ''}>
                        README
                    </S.NavLink>
                </Link>
                <Link to='/diagram'>
                    <S.NavLink className={location.pathname === '/diagram' ? 'active' : ''}>
                        DIAGRAM
                    </S.NavLink>
                </Link>
                <Link to='/report'>
                    <S.NavLink className={location.pathname === '/report' ? 'active' : ''}>
                        GITHUB REPORT
                    </S.NavLink>
                </Link>
                <Link to='/myprojects'>
                    <S.NavLink className={location.pathname === '/myprojects' ? 'active' : ''}>
                        MY PROJECTS
                    </S.NavLink>
                </Link>
            </S.NavLinks>
            <Link to={logined ? '/myprojects' : '/login'}>
                <S.NavLink className={location.pathname === '/login' || location.pathname === '/myprojects' ? 'active' : ''}>
                    {logined ? (
                        <img
                            src={userImage || altlogo}
                            style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                            alt="User Profile"
                        />
                    ) : '로그인'}
                </S.NavLink>
            </Link>
        </S.HeaderLayout>
    );
}

export default Header;

export default function LogIn() {
    return (
        <>
             <div className="sign-in-page">
                <h1>
                    Log in to your account
                </h1>
                <form className="sign-in-form">
                    <input type="text" placeholder="Логин" />
                    <input type="password" placeholder="Пароль" />
                    {/*надо сделать так, чтобы при нажатии на кнопку "Войти" происходила авторизация,
                     а не переход на страницу профиля, но для этого нужно будет написать бэкенд, так что пок
                     а что просто сделаем переход на страницу профиля;*/}
                    <a href="/Profile">
                        <button type="submit">Войти </button>
                    </a>

                    <div className="Forgot-Password">
                        <a href="/forgot-password">
                            <button>Забыли пароль?</button>
                        </a>

                    </div>
                </form>
            </div>
        </>
    );
}

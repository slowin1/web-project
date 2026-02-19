export default function ForgotPassword() {
  return (
    <>
        <div className="sign-in-page">
                <h1>
                    Forgot Password
                </h1>
                <form className="sign-in-form">
                    <input type="text" placeholder="Введите ваш email" />
                    <div className="confimation-code">
                        <input type="text" placeholder="Введите код подтверждения" />
                    </div>

                    {/*надо сделать так, чтобы при нажатии на кнопку "Войти" происходила авторизация,
                     а не переход на страницу профиля, но для этого нужно будет написать бэкенд, так что пок
                     а что просто сделаем переход на страницу профиля;*/}
                    <a href="/Profile">
                        <button type="submit">Восстановить пароль</button>
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

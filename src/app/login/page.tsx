import LoginForm from './login-form';

export default function LoginPage() {
  return (
    <main
      style={{
        backgroundImage:
          "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
        backgroundSize: '100% 100%',
      }}
      className="flex h-lvh items-center justify-center md:h-screen"
    >
      <LoginForm />
    </main>
  );
}

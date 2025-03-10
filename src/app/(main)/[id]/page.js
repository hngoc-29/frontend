import Main from './Main';
const MainPage = async ({ params }) => {
    const { id } = await params;

    return (
        <div>
            <Main id={id} />
        </div>
    );
};

export default MainPage;

// @ts-nocheck

const FooterComponent = () => {
    return (
        <footer style={{ fontSize: '12px', backgroundColor: '#f8f8f8' }}>
            <div style={{ flexDirection: 'column-reverse', alignItems: 'center', display: 'flex', textAlign: 'left', padding: '10px', backgroundColor: '#f8f8f8' }}>
                <p>
                    Made with <span style={{ color: 'red' }}>❤</span> by
                    <a
                        href="https://www.linkedin.com/in/rivera-daniel-david/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ marginLeft: '5px', textDecoration: 'none', color: '#0077b5' }}
                    >
                        2024 Design RDA Inc.
                    </a>
                </p>
                <p>
                    <span style={{ textAlign: 'right' }}>Thanks </span>
                    <a
                        href="https://chatgpt.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none', color: '#0077b5' }}
                    >
                        ChatGpt
                    </a>
                    <span > | </span>
                    <a
                        href="https://iconscout.com/icons/google-maps"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none', color: '#0077b5' }}
                    >
                        Google Maps
                    </a>
                    <span> by </span>
                    <a
                        href="https://iconscout.com/contributors/icon-mafia"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none', color: '#0077b5' }}
                    >
                        Icon Scout
                    </a>
                    <span > | </span>
                </p>

            </div>
        </footer>
    );
}

export default FooterComponent;

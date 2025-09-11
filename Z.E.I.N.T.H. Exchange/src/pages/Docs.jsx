import React from 'react';
import Layout from '../components/Layout';

const Docs = () => {
    return (
        <Layout>
            <main className="flex-grow flex flex-col items-center justify-center px-4 py-12">
                <div className="text-center w-full max-w-2xl">
                    <h1 className="text-5xl font-bold text-white">Z.E.N.I.T.H. Docs</h1>
                    <p className="text-stardust-grey mt-4">
                        Comprehensive documentation, guides, and API references for the Z.E.N.I.T.H. Protocol.
                        Content will be available here soon.
                    </p>
                </div>
            </main>
        </Layout>
    );
};

export default Docs;
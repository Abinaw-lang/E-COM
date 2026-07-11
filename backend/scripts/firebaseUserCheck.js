import dotenv from 'dotenv';
dotenv.config();

// Dynamically import config after env vars are loaded to prevent ES modules hoisting issues
const { firestore, admin } = await import('../config/firebase.js');

const run = async () => {
    const args = process.argv.slice(2);
    const action = args[0] || 'list'; // 'list' or 'promote' or 'create-admin'
    const emailVal = args[1];
    const passwordVal = args[2] || 'admin123';

    try {
        if (action === 'list') {
            console.log('Querying Firestore Users...');
            const snap = await firestore.collection('users').get();
            if (snap.empty) {
                console.log('No users found in Firestore users collection.');
                console.log('To register a user, sign up on the client storefront, then use:');
                console.log('  node scripts/firebaseUserCheck.js promote <email>');
            } else {
                console.log('\n--- Registered Users ---');
                snap.docs.forEach((doc) => {
                    const u = doc.data();
                    console.log(`- UID: ${doc.id} | Email: ${u.email} | Name: ${u.name || 'N/A'} | Role: ${u.role}`);
                });
            }
        }

        else if (action === 'promote') {
            if (!emailVal) {
                console.log('Error: Please specify the email to promote. Example:');
                console.log('  node scripts/firebaseUserCheck.js promote test@example.com');
                process.exit(1);
            }

            console.log(`Locating user with email "${emailVal}" in Firestore...`);
            const snap = await firestore.collection('users').where('email', '==', emailVal).limit(1).get();

            if (snap.empty) {
                console.log(`Error: User with email "${emailVal}" not found in Firestore.`);
                console.log('Please register this user via the frontend signup page first.');
                process.exit(1);
            }

            const doc = snap.docs[0];
            await firestore.collection('users').doc(doc.id).update({ role: 'admin' });
            console.log(`✓ Successfully promoted user "${emailVal}" (UID: ${doc.id}) to role: admin`);
        }

        else if (action === 'create-admin') {
            if (!emailVal) {
                console.log('Error: Please specify email and password. Example:');
                console.log('  node scripts/firebaseUserCheck.js create-admin admin@ecommerce.com admin123');
                process.exit(1);
            }

            console.log(`Checking if email "${emailVal}" already exists in Firebase Auth...`);

            let userRecord;
            try {
                userRecord = await admin.auth().getUserByEmail(emailVal);
                console.log(`User exists in Firebase Auth already: UID is ${userRecord.uid}`);
            } catch (authErr) {
                if (authErr.code === 'auth/user-not-found') {
                    console.log(`Creating user in Firebase Auth with email "${emailVal}"...`);
                    userRecord = await admin.auth().createUser({
                        email: emailVal,
                        password: passwordVal,
                        displayName: 'Admin User'
                    });
                    console.log(`✓ Successfully created user in Auth: UID is ${userRecord.uid}`);
                } else {
                    throw authErr;
                }
            }

            console.log(`Setting document "users/${userRecord.uid}" in Firestore with role "admin"...`);
            await firestore.collection('users').doc(userRecord.uid).set({
                uid: userRecord.uid,
                email: emailVal,
                name: 'Admin User',
                role: 'admin',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }, { merge: true });

            console.log(`✓ Admin User created/updated successfully with role: admin`);
            console.log(`📧 Email: ${emailVal}`);
            console.log(`🔑 Password: ${passwordVal}`);
        }

        process.exit(0);
    } catch (err) {
        console.error('Execution failed:', err);
        process.exit(1);
    }
};

run();

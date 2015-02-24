package dk.in2isoft.onlineobjects.core;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

import org.apache.commons.codec.binary.Base64;
import org.apache.log4j.Logger;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.core.exceptions.ExplodingClusterFuckException;

public class PasswordEncryptionService {
	
	private static Logger log = Logger.getLogger(PasswordEncryptionService.class);
	
	public boolean authenticate(String attemptedPassword, String encryptedPassword, String salt) {
		try {
			// Encrypt the clear-text password using the same salt that was used to
			// encrypt the original password
			String encryptedAttemptedPassword = getEncryptedPassword(attemptedPassword, salt);
	
			// Authentication succeeds if encrypted password that the user entered
			// is equal to the stored hash
			return Strings.equals(encryptedPassword, encryptedAttemptedPassword);
		} catch (ExplodingClusterFuckException e) {
			log.error("Unable to authenticate", e);
		}
		return false;
	}

	public String getEncryptedPassword(String password, String salt) throws ExplodingClusterFuckException {
		try {
		// PBKDF2 with SHA-1 as the hashing algorithm. Note that the NIST
		// specifically names SHA-1 as an acceptable hashing algorithm for
		// PBKDF2
		String algorithm = "PBKDF2WithHmacSHA1";
		// SHA-1 generates 160 bit hashes, so that's what makes sense here
		int derivedKeyLength = 160;
		// Pick an iteration count that works for you. The NIST recommends at
		// least 1,000 iterations:
		// http://csrc.nist.gov/publications/nistpubs/800-132/nist-sp800-132.pdf
		// iOS 4.x reportedly uses 10,000:
		// http://blog.crackpassword.com/2010/09/smartphone-forensics-cracking-blackberry-backup-passwords/
		int iterations = 20000;

		byte[] saltBytes = Base64.decodeBase64(salt);
		KeySpec spec = new PBEKeySpec(password.toCharArray(), saltBytes, iterations, derivedKeyLength);

		SecretKeyFactory f = SecretKeyFactory.getInstance(algorithm);

		return Base64.encodeBase64String(f.generateSecret(spec).getEncoded());
		} catch (NoSuchAlgorithmException e) {
			log.error("Unable to authenticate", e);
			throw new ExplodingClusterFuckException(e);
		} catch (InvalidKeySpecException e) {
			log.error("Unable to authenticate", e);
			throw new ExplodingClusterFuckException(e);
		}
	}

	public String generateSalt() throws ExplodingClusterFuckException {
		// VERY important to use SecureRandom instead of just Random
		try {
			SecureRandom random = SecureRandom.getInstance("SHA1PRNG");

			// Generate a 8 byte (64 bit) salt as recommended by RSA PKCS5
			byte[] salt = new byte[8];
			random.nextBytes(salt);

			return Base64.encodeBase64String(salt);
		} catch (NoSuchAlgorithmException e) {
			throw new ExplodingClusterFuckException(e);
		}
	}
}
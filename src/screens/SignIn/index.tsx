import { Container, Slogan, Title } from "./styles";
import backgroundImage from '../../assets/background.png'
import { Button } from "../../components/Button";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google'
import { ANDROID_CLIENT_ID, IOS_CLIENT_ID } from '@env'
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Realm, useApp } from '@realm/react';
WebBrowser.maybeCompleteAuthSession();

export function SignIn() {
  const [loadingAutheticate, setLoadingAutheticate] = useState(false)

  const [_, response, googleSignIn] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    scopes: ['profile', 'email']
  })
  const app = useApp();
  function handleGoogleSignIn() {
    setLoadingAutheticate(true)
    googleSignIn().then((response) => {
      if (response.type !== "success") {
        setLoadingAutheticate(false)
      }
    })
  }

  useEffect(() => {
    if(response?.type === "success") {
      if(response.authentication?.idToken){
        const credentials = Realm.Credentials.jwt(response.authentication.idToken);

        app.logIn(credentials).catch((error) => {
          console.log(error);
          Alert.alert('Entrar', 'Não foi possível conectar-se a sua conta google.')
          setLoadingAutheticate(false);
        })
      } else {
        Alert.alert("Entrar", "Não foi possível conectar-se a sua conta google")
      }
    }

  }, [response])

  return (
    <Container
      source={backgroundImage}
    >
      <Title>
        Fleet App
      </Title>
      <Slogan>
        Gestão de uso de veiculos
      </Slogan>

      <Button
        title="Entrar com google"
        onPress={handleGoogleSignIn}
        isLoading={loadingAutheticate}
      />
    </Container>
  )
}
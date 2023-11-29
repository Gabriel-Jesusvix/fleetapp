import { useNavigation, useRoute } from '@react-navigation/native';

import { Container, Content, Description, Footer, Label, LicensePlate, AsyncMessage } from './styles';
import { HeaderDeparture } from '../../components/HeaderDeparture';
import { Button } from '../../components/Button';
import { ButtonIcon } from '../../components/ButtonIcon';
import { X } from 'phosphor-react-native';
import { useObject, useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';
import { BSON } from 'realm';
import { Alert } from 'react-native';
import { getLastAsyncTimestamp } from '../../libs/asyncStorage/syncStorage';
import { useEffect, useState } from 'react';
import { stopLocationTask } from '../../tasks/backgroundLocationTask';

type RouteParamProps = {
  id: string;
}

export function Arrival() {

  const route = useRoute();
  const realm = useRealm();
  const { goBack } = useNavigation();
  const { id } = route.params as RouteParamProps;
  const historic = useObject(Historic, new BSON.UUID(id) as unknown as string)
  const title = historic?.status === 'departure' ? 'Chegada' : 'Detalhes';
  const [dataNotSynced, setDataNotSynced] = useState(false);

  function handleRemoveVehicleUsage() {
    Alert.alert(
      'Cancelar',
      'Cancelar a utilização do veículo?',
      [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim', onPress: () => removeVehicleUsage() },
      ]
    )
  }

  function removeVehicleUsage() {
    realm.write(() => {
      realm.delete(historic)
    });

    goBack();
  }

  async function handleArrivalRegister() {
    try {

      if (!historic) {
        return Alert.alert('Erro', 'Não foi possível obter os dados para registrar a chegada do veículo.')
      }

      await stopLocationTask()
      realm.write(() => {
        historic.status = 'arrival';
        historic.updated_at = new Date();
      });

      Alert.alert('Chegada', 'Chegada registrada com sucesso.');
      goBack();

    } catch (error) {
      Alert.alert('Erro', "Não foi possível registar a chegada do veículo.")
    }
  }

  useEffect(() => {

    getLastAsyncTimestamp()
      .then(lastSync => setDataNotSynced(historic!.updated_at.getTime() > lastSync));

  },[])
  return (
    <Container>
      <HeaderDeparture title={title} />
      <Content>
        <Label>
          Placa do veículo
        </Label>

        <LicensePlate>
          {historic?.license_plate}
        </LicensePlate>

        <Label>
          Finalidade
        </Label>

        <Description>
          {historic?.description}
        </Description>
      </Content>
      {
        historic?.status === 'departure' &&
        <Footer>
          <ButtonIcon
            icon={X}
            onPress={handleRemoveVehicleUsage}
          />

          <Button
            title='Registrar chegada'
            onPress={handleArrivalRegister}
          />
        </Footer>
      }

       {
          dataNotSynced && 
          <AsyncMessage>
            Sincronização da {historic?.status === 'departure'? "partida" : "chegada"} pendente
          </AsyncMessage>
        }
    </Container>
  );
}
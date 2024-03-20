import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { observer } from 'mobx-react';
import type { FC } from 'react';
import { Fragment, useEffect, useState } from 'react';
import { toggleNetwork } from '@/dapi';
import { useStore } from '@/store';
import { getAppNetwork, setAppNetwork } from '@/utils/storage';
import { NetworkList } from '@/utils/values';

type Props = {
  onChange?: (network: string) => void;
};

export const NetworkSelect: FC<Props> = observer(props => {
  const { assetStore, walletStore } = useStore();
  const [network, setNetwork] = useState('MainNet');

  useEffect(() => {
    const savedNetwork = getAppNetwork();
    const currentNetwork = savedNetwork ?? 'MainNet';
    setNetwork(currentNetwork);
    // if savedNetwork null
    if (currentNetwork !== savedNetwork) {
      setAppNetwork(currentNetwork);
    }
  }, []);

  const onMenuClick = async (newNetwork: string) => {
    const currentNetwork = network.slice();
    if (newNetwork !== currentNetwork) {
      await toggleNetwork(newNetwork);
      setNetwork(newNetwork);
      setAppNetwork(newNetwork);
      await walletStore.fetchActiveBalances();
      await assetStore.updateAssets();
      if (props.onChange) {
        props.onChange(newNetwork);
      }
    }
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          className={
            'text-themeGray bg-networkSelectBack inline-flex items-center px-3 py-2 rounded-xl w-36'
          }>
          <div className="w-2 h-2 bg-networkSelectGreen rounded-full" />
          <p className="text-themeGray text-lg ml-2">{network}</p>
          <ChevronDownIcon className="h-6 w-6 ml-4" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95">
        <Menu.Items className="absolute right-0 z-10 w-36 mt-1 origin-top-right rounded-xl bg-networkSelectBack focus:outline-none">
          <div>
            {NetworkList.map(net => {
              return (
                <Menu.Item key={net}>
                  {({ active }) => (
                    <button
                      onClick={async () => onMenuClick(net)}
                      className={`w-full flex justify-center items-center ${
                        active ? 'bg-white' : ''
                      } block w-full py-4 text-sm`}>
                      <p className="text-themeGray text-lg">{net}</p>
                    </button>
                  )}
                </Menu.Item>
              );
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
});

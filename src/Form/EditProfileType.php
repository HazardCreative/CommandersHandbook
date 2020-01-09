<?php
namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\ColorType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
// use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;

class EditProfileType extends AbstractType {
	public function buildForm(FormBuilderInterface $builder, array $options)
	{
		$builder
			->addEventListener(FormEvents::PRE_SET_DATA, function (FormEvent $event){
				$user = $event->getData();
				$form = $event->getForm();

				$form->add('username', TextType::class, array(
					'required' => true,
					'label' => 'Username (required)'
				))
				->add('profile_realname', TextType::class, array(
					'required' => false,
					'label' => 'Real Name'
				))
				->add('profile_is_public', CheckboxType::class, array(
					'required' => false,
					'label' => 'Include me in player community'
				))
				->add('profile_display_email', CheckboxType::class, array(
					'required' => false,
					'label' => 'Allow logged-in users to see my e-mail address'
				));

				if (new \DateTime("now") < $user->getEliteExpires()) {
					$form->add('profile_color', ColorType::class, array(
						'required' => true,
						'label' => 'Color'
					));
					$form->add('profile_icon', ChoiceType::class, array(
						'required' => false,
						'label' => 'Icon',
						'choices' => array(
							'Chub (default)' => null,
							'Chub (rifle)' => 'chub-alt',
							'Commissar' => 'commissar',
							'Hi-leg' => 'hi-leg',
							'Scrambler' => 'scrambler',
						),
					));
				}

				$form->add('profile_game_preferences', TextareaType::class, array(
				'required' => false,
				'label' => 'Game Preferences (battle or skirmish? number of players? optional rules?)'
				))
				->add('profile_materials', TextareaType::class, array(
					'required' => false,
					'label' => 'Materials (do you have/need/can lend frames? dice? rulers? playmats?)'
				))
				->add('profile_experience', TextareaType::class, array(
					'required' => false,
					'label' => 'Experience (tactical skill? familiarity with rules?)'
				))
				->add('save', SubmitType::class, array(
					'label' => 'Save Profile',
					'attr' => array(
						'class' => 'ui-btn ui-btn-a ui-corner-all'
					)
				));
			})
		;
	}
}
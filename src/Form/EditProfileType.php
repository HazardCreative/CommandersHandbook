<?php
namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
// use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;

class EditProfileType extends AbstractType {
	public function buildForm(FormBuilderInterface $builder, array $options)
	{
		$builder
			->add('username', TextType::class, array(
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
			))
			->add('profile_game_preferences', TextareaType::class, array(
				'required' => false,
				'label' => 'Game Preferences (battle or skirmish, number of players, optional rules)'
			))
			->add('profile_materials', TextareaType::class, array(
				'required' => false,
				'label' => 'Materials (do you have, need or can lend frames, dice, rulers, playmats?)'
			))
			->add('profile_experience', TextareaType::class, array(
				'required' => false,
				'label' => 'Experience (tactical skill, familiarity with rules)'
			))
			->add('save', SubmitType::class, array(
				'label' => 'Save Profile',
				'attr' => array(
					'class' => 'ui-btn ui-btn-a ui-corner-all'
				)
			))
		;
	}
}